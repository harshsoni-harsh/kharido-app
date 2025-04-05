import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Cart } from '@libs/shared/schemas/cart.schema';
import { Order } from '@libs/shared/schemas/order.schema';
import { Product } from '@libs/shared/schemas/product.schema';
import { Review } from '@libs/shared/schemas/review.schema';
import { ShoppingList } from '@libs/shared/schemas/shoppingList.schema';
import { User } from '@libs/shared/schemas/user.schema';
import mongoose, { ClientSession, Model, Types } from 'mongoose';
import { CreateProductDTO } from '@libs/shared/dto/create/createProduct.dto';
import { UpdateProductDTO } from '@libs/shared/dto/update/updateProduct.dto';
import { STATUS_CODES } from 'http';
import { CreateCategoryDTO } from '@libs/shared/dto/create/createCategory.dto';
import { Category } from '@libs/shared/schemas/category.schema';
import { UpdateCategoryDTO } from '@libs/shared/dto/update/updateCategory.dto';
import { count } from 'console';
import { Payment } from '@libs/shared/schemas/payment.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('ShoppingList')
    private readonly shoppingListModel: Model<ShoppingList>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,

    @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
  ) {}

  ///order management
  async getOrdersRange(
    startIndex: number,
    endIndex: number,
  ): Promise<{
    statusCode: number;
    orders: any[];
    metadata: {
      total: number;
      returned: number;
      range: { start: number; end: number };
    };
  }> {
    if (typeof startIndex !== 'number' || typeof endIndex !== 'number') {
      throw new BadRequestException(
        'Both startIndex and endIndex must be numbers',
      );
    }

    if (startIndex < 0 || endIndex < 0) {
      throw new BadRequestException('Index values cannot be negative');
    }

    if (startIndex >= endIndex) {
      throw new BadRequestException('startIndex must be less than endIndex');
    }

    const pageSize = endIndex - startIndex;
    if (pageSize > 100) {
      throw new BadRequestException('Maximum range size of 100 exceeded');
    }

    const [orders, totalCount] = await Promise.all([
      this.orderModel
        .find()
        .sort({ createdAt: 1 })
        .skip(startIndex)
        .limit(pageSize)
        .lean()
        .exec(),
      this.orderModel.countDocuments().exec(),
    ]);

    // if (startIndex > totalCount) {
    //   throw new NotFoundException('Requested range exceeds available orders');
    // }

    return {
      statusCode: 200,
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
      })),
      metadata: {
        total: totalCount,
        returned: orders.length,
        range: { start: startIndex, end: Math.min(endIndex, totalCount) },
      },
    };
  }

  async getOrdersInterval(startTime: string, endTime: string): Promise<{ orders: any[], totalCount: number }> {
    // Create date objects from the input strings
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
  
    // Find orders within the time range
    const orders = await this.orderModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
  
    // Get the count of orders in the same range
    const totalCount = await this.orderModel.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
  
    return {
      orders,
      totalCount
    };
  }

  async getOrder(orderId: string) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }
    const order = await this.orderModel
      .findOne({ _id: orderId })
      .select('items')
      .populate('items.product', '_id')
      .lean()
      .exec();
    if (!order) {
      throw new NotFoundException('order not found');
    }

    return {
      statusCode: 200,
      order: order,
    };
  }
  async updateOrder(
    orderId: string,
    status: string,
    metadata?: {
      changedBy?: string;
      notes?: string;
    },
  ): Promise<{
    statusCode: number;
    message: string;
    order: any;
    timestamp: string;
  }> {
    // Input Validation
    if (!orderId?.trim()) {
      throw new BadRequestException('Order ID is required');
    }

    if (!mongoose.isValidObjectId(orderId)) {
      throw new BadRequestException('Invalid Order ID format');
    }

    if (!status?.trim()) {
      throw new BadRequestException('Status is required');
    }

    // Define valid status transitions
    // const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    // if (!validStatuses.includes(status)) {
    //   throw new BadRequestException(
    //     `Invalid status. Valid values are: ${validStatuses.join(', ')}`
    //   );
    // }

    const session = await this.orderModel.startSession();
    session.startTransaction();

    try {
      const order = await this.orderModel.findById(orderId).lean().exec();

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      const currentStatus = order.status.slice(-1)[0]?.property;
      if (currentStatus === status) {
        throw new ConflictException(`Order is already in status: ${status}`);
      }

      const statusUpdate = {
        property: status,
        time: new Date(),
        changedBy: metadata?.changedBy || 'system',
        notes: metadata?.notes || '',
      };

      const updatedOrder = await this.orderModel.findByIdAndUpdate(
        orderId,
        {
          $push: { status: statusUpdate },
        },
        { new: true, session },
      );

      await session.commitTransaction();

      return {
        statusCode: 200,
        message: 'Order status updated successfully',
        order: {
          id: updatedOrder?._id,
          orderNumber: orderId,
          currentStatus: status,
          previousStatus: currentStatus,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      await session.abortTransaction();

      Logger.error(`Order update failed for ${orderId}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update order status');
    } finally {
      session.endSession();
    }
  }
  // private async handleStatusChangeSideEffects(
  //   orderId: string,
  //   newStatus: string,
  //   session: ClientSession,
  // ): Promise<void> {
    // // Example side effects:
    // if (newStatus === 'shipped') {
    //   await this.inventoryService.updateStockForOrder(orderId, session);
    //   await this.notificationService.sendShippingNotification(orderId);
    // }
    // if (newStatus === 'cancelled') {
    //   await this.paymentService.processRefund(orderId, session);
    // }
  // }
  async getPayment(paymentId: string) {
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      throw new BadRequestException('Invalid payment ID format');
    }
    const payment = await this.paymentModel
      .findOne({ _id: paymentId })
      .lean()
      .exec();
    if (!payment) {
      throw new NotFoundException('payment not found');
    }

    return {
      statusCode: 200,
      payment: payment,
    };
  }

  //analytics

  async getTotalUsers(): Promise<number> {
    return await this.userModel.countDocuments().exec();
  }

  async getRevenueByInterval(
    startTime: string,
    endTime: string,
  ): Promise<{
    statusCode: number;
    message: string;
    revenue?: number;
    data?: any;
  }> {
    try {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      if (isNaN(startDate.getTime())) {
        return {
          statusCode: 400,
          message: 'Invalid start date format',
        };
      }

      if (isNaN(endDate.getTime())) {
        return {
          statusCode: 400,
          message: 'Invalid end date format',
        };
      }

      if (startDate >= endDate) {
        return {
          statusCode: 400,
          message: 'Start date must be before end date',
        };
      }

      const result = await this.orderModel
        .aggregate([
          {
            $match: {
              createdAt: {
                $gte: startDate,
                $lt: endDate,
              },
              status: {
                $not: {
                  $elemMatch: { property: 'cancelled' }
                }
              }
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalAmount.netAmount' },
              orderCount: { $sum: 1 },
            },
          },
        ])
        .exec();

      const revenueData = result[0] || { totalRevenue: 0, orderCount: 0 };

      return {
        statusCode: 200,
        message: 'Revenue calculated successfully',
        revenue: revenueData.totalRevenue,
        data: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          orderCount: revenueData.orderCount,
          averageOrderValue:
            revenueData.orderCount > 0
              ? revenueData.totalRevenue / revenueData.orderCount
              : 0,
        },
      };
    } catch (error) {
      console.error('Error calculating revenue:', error);
      return {
        statusCode: 500,
        message: 'Failed to calculate revenue',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    }
  }
  async getOrdersPerDay(startTime: string, endTime: string) {
    //return {number of orders per day ,  day} array
  }
  async getRecentOrders(
    count: number,
  ): Promise<{ statusCode: number; orders: any[]; timestamp: string }> {
    if (!count || count <= 0 || count > 100) {
      throw new BadRequestException('Count must be between 1 and 100');
    }

    const orders = await this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(count)
      .lean()
      .exec();

    const transformedOrders = orders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
    }));

    return {
      statusCode: 200,
      orders: transformedOrders,
      timestamp: new Date().toISOString(),
    };
  }
  async getTotalProductsSold(
    startTime: string,
    endTime: string,
  ): Promise<{ statusCode: number; count: number; metadata?: any }> {
    if (!startTime || !endTime) {
      throw new BadRequestException('Both startTime and endTime are required');
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (startDate >= endDate) {
      throw new BadRequestException('startTime must be before endTime');
    }

    //MongoDB aggregation
    const result = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
          status: {
            $not: {
              $elemMatch: {
                property: 'cancelled',
              },
            },
          },
        },
      },
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$items.quantity' },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const total = result[0]?.totalQuantity || 0;

    return {
      statusCode: 200,
      count: total,
      metadata: {
        timeRange: { start: startDate, end: endDate },
        orderCount: result[0]?.orderCount || 0,
      },
    };
  }
  //product management
  async createProduct(product: CreateProductDTO) {
    try {
      const newProduct = await this.productModel.create({
        ...product,
        discontinued: 'false',
      });
      return {
        statusCode: 201,
        product: newProduct,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 400,
        message: 'Internal server error',
      };
    }
  }
  async updateProduct(
    product: UpdateProductDTO,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    const session = await this.productModel.startSession();
    session.startTransaction();

    try {
      if (!product._id || !Types.ObjectId.isValid(product._id)) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid product ID format',
        };
      }
      const existingProduct = await this.productModel
        .findById(product._id)
        .session(session)
        .lean();

      if (!existingProduct) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'Product not found',
        };
      }

      const updateData: Partial<Product> = { ...product };
      delete updateData.createdAt;
      delete updateData.reviews;

      // 4. Add updatedAt timestamp
      updateData.updatedAt = new Date();

      // 5. Perform the update
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(
          product._id,
          { $set: updateData },
          { new: true, session },
        )
        .select('-__v')
        .lean();

      await session.commitTransaction();

      return {
        statusCode: 200,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error updating product:', error);
      return {
        statusCode: 500,
        message: 'Failed to update product',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }

  async deleteProduct(productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid category ID format');
    }
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException('No Product with given id exists');
    }
    product.discontinued = 'true';
    await product.save();
    return {
      statusCode: 200,
      message: 'Product discontinued',
    };
  }

  //category management
  async createCategory(category: CreateCategoryDTO) {
    const existing = await this.categoryModel
      .find({ sku: category.sku })
      .exec();
    if (existing) {
      throw new BadRequestException(
        `Existing category with sku ${category.sku}  found`,
      );
    }
    const newCat = await this.categoryModel.create(category);

    return { message: 'Category created successfully', category: newCat };
  }

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException('Invalid category ID format');
    }

    const category = await this.categoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const result = await this.categoryModel
      .deleteOne({ _id: categoryId })
      .exec();

    if (result.deletedCount === 0) {
      throw new InternalServerErrorException('Failed to delete category');
    }

    await this.cleanUpAfterCategoryDeletion(categoryId);

    return { message: 'Category deleted successfully' };
  }

  private async cleanUpAfterCategoryDeletion(
    categoryId: string,
  ): Promise<void> {
    await this.productModel
      .updateMany(
        { categories: categoryId },
        { $pull: { categories: categoryId } },
      )
      .exec();
  }

  async updateCategory(
    category: UpdateCategoryDTO,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    const session = await this.categoryModel.startSession();
    session.startTransaction();

    try {
      if (!category._id || !Types.ObjectId.isValid(category._id)) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid category ID format',
        };
      }

      const existingCategory = await this.categoryModel
        .findById(category._id)
        .session(session)
        .lean();

      if (!existingCategory) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'Category not found',
        };
      }

      const updateData: Partial<Category> = {
        updatedAt: new Date(),
      };

      if (category.name !== undefined) updateData.name = category.name;
      if (category.sku !== undefined) updateData.sku = category.sku;
      if (category.description !== undefined)
        updateData.description = category.description;
      if (category.defaultTax !== undefined)
        updateData.defaultTax = category.defaultTax;

      if (category.imageLinks !== undefined)
        updateData.imageLinks = category.imageLinks;
      if (category.searchTags !== undefined)
        updateData.searchTags = category.searchTags;

      if (category.products !== undefined) {
        updateData.products = category.products.map(
          (id) => new Types.ObjectId(id),
        );
      }
      if (category.topProducts !== undefined) {
        updateData.topProducts = category.topProducts.map(
          (id) => new Types.ObjectId(id),
        );
      }

      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(
          category._id,
          { $set: updateData },
          { new: true, session },
        )
        .select('-__v')
        .lean();

      await session.commitTransaction();

      return {
        statusCode: 200,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error updating category:', error);
      return {
        statusCode: 500,
        message: 'Failed to update category',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }
  //user management
  async getUsers(startIndex: number, endIndex: number) {
    if (!startIndex || !endIndex) {
      throw new BadRequestException(
        'Both startIndex and endIndex are required',
      );
    }
    if (startIndex >= endIndex) {
      throw new BadRequestException('startIndex must be before endIndex');
    }

    const users = await this.userModel
      .find()
      .sort({ createdAt: 1 })
      .skip(startIndex)
      .limit(endIndex)
      .exec();

    return {
      statusCode: 200,
      users: users,
      count: users.length,
    };
  }
  async getUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID format');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return {
      statusCode: 200,
      user: user.toObject(),
    };
  }
}
