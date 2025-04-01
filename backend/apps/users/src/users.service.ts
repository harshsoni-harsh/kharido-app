import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { User } from '../../../libs/shared/schemas/user.schema';
import { CreateUserDto } from '@libs/shared/dto/create/createUser.dto';
import { Order } from '@libs/shared/schemas/order.schema';
import { Product } from '@libs/shared/schemas/product.schema';
import { ShoppingList } from '@libs/shared/schemas/shoppingList.schema';
import { Cart } from '@libs/shared/schemas/cart.schema';
import { AddressDTO } from '@libs/shared/dto/common/address.dto';
import { CreateReviewDTO } from '@libs/shared/dto/create/createReview.dto';
import { UpdateReviewDTO } from '@libs/shared/dto/update/updateReview.dto';
import { Review } from '@libs/shared/schemas/review.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
    @InjectModel('ShoppingList')
    private readonly shoppingListModel: Model<ShoppingList>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
  ) {}

  //handles user updates
  async getUserMeta(email: string) {
    //just returns the user name, email,gender,role,createdAt, not the nested objects
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userDetails = {
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
      };
      return userDetails;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      if (!createUserDto.email || !createUserDto.name) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Name and email are required',
        };
      }
      const existingUser = await this.userModel
        .findOne({ email: createUserDto.email })
        .session(session)
        .lean();

      if (existingUser) {
        await session.abortTransaction();
        return {
          statusCode: 409,
          message: 'User with this email already exists',
        };
      }

      const userData = {
        name: createUserDto.name.trim(),
        email: createUserDto.email.toLowerCase().trim(),
        gender: createUserDto.gender || 'unspecified',
        addresses: createUserDto.addresses || [],
        role: 'user',
        createdAt: new Date(),
        // updatedAt: new Date(),
      };
      const newUser = await this.userModel.create([userData], { session });
      await session.commitTransaction();

      const userResponse = {
        _id: newUser[0]._id,
        name: newUser[0].name,
        email: newUser[0].email,
        gender: newUser[0].gender,
        role: newUser[0].role,
        createdAt: newUser[0].createdAt
      };

      return {
        statusCode: 201,
        message: 'User created successfully',
        data: userResponse,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating user:', error);

      if (error.code === 11000) {
        return {
          statusCode: 409,
          message: 'User with this email already exists',
        };
      }

      return {
        statusCode: 500,
        message: 'Failed to create user',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }
  // product related
  // handles order related reqs
  async getAllOrdersMeta(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!user.orders || user.orders.length === 0) {
        throw new NotFoundException('Orders not found');
      }
      const orderIds = user.orders;
      const orders = await this.orderModel
        .find({ _id: { $in: orderIds } })
        .exec();
      console.log(orders);
      const ordersWithoutItems = orders.map((order) => {
        const { items, ...rest } = order.toObject();
        return rest;
      });
      // if whole user needs to be returned
      // const userWithOrders = {
      //   ...user.toObject(),
      //   orders: ordersWithoutItems,
      // };
      // console.log(userWithOrders)
      return ordersWithoutItems;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new InternalServerErrorException('Failed to fetch user orders');
    }
  }

  async getOrder(email: string, id: string) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        return null;
      }
      if (!user.orders) {
        throw new NotFoundException('Orders not found');
      }
      const order = await this.orderModel
        .findOne({ id: id, email: email })
        .exec();
      console.log(order);
      const loadedItems = await Promise.all(
        (order?.items ?? []).map(async (it) => {
          const currProduct = (await this.ProductModel.findById(
            it.product,
          ).exec()) as any;
          // console.log(currProduct, it.product);
          delete currProduct?._id;
          delete currProduct?.reviews;
          const loadedItem = {
            ...it,
          };
          loadedItem.product = currProduct?._doc; // or currProduct?.toObject()
          return loadedItem;
        }),
      );
      if (order) order.items = loadedItems;
      console.log(loadedItems);
      return order;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new InternalServerErrorException('Failed to fetch user orders');
      // return null;
    }
  }

  async addressUpdate({
    email,
    action,
    address,
  }: {
    email: string;
    action: string;
    address?: AddressDTO;
  }): Promise<{ statusCode: number; message: string; data?: any }> {
    const MAX_ADDRESSES = 10;
    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      // 1. Validate inputs
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid email format',
        };
      }

      if (!['create', 'update', 'remove'].includes(action)) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid action specified',
        };
      }

      if ((action === 'create' || action === 'update') && !address) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Address is required for this action',
        };
      }

      // 2. Find user with addresses
      const user = await this.userModel
        .findOne({ email })
        .select('addresses')
        .session(session);

      if (!user) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }

      // 3. Handle different actions
      let updateOperation;
      let responseMessage = 'Address updated successfully';

      switch (action) {
        case 'create':
          if (user.addresses.length >= MAX_ADDRESSES) {
            await session.abortTransaction();
            return {
              statusCode: 400,
              message: `Maximum ${MAX_ADDRESSES} addresses allowed`,
            };
          }

          const existingAddressIndex = user.addresses.findIndex(
            (addr) => addr.name === address!.name,
          );

          if (existingAddressIndex >= 0) {
            await session.abortTransaction();
            return {
              statusCode: 400,
              message: 'Address with this name already exists',
            };
          }

          updateOperation = {
            $push: { addresses: address },
            $set: { updatedAt: new Date() },
          };
          responseMessage = 'Address added successfully';
          break;

        case 'update':
          const updateIndex = user.addresses.findIndex(
            (addr) => addr.name === address!.name,
          );

          if (updateIndex === -1) {
            await session.abortTransaction();
            return {
              statusCode: 404,
              message: 'Address not found',
            };
          }

          updateOperation = {
            $set: {
              [`addresses.${updateIndex}`]: address,
              updatedAt: new Date(),
            },
          };
          break;

        case 'remove':
          if (!address?.name) {
            await session.abortTransaction();
            return {
              statusCode: 400,
              message: 'Address name is required for removal',
            };
          }

          const removeIndex = user.addresses.findIndex(
            (addr) => addr.name === address.name,
          );

          if (removeIndex === -1) {
            await session.abortTransaction();
            return {
              statusCode: 404,
              message: 'Address not found',
            };
          }

          updateOperation = {
            $pull: { addresses: { name: address.name } },
            $set: { updatedAt: new Date() },
          };
          responseMessage = 'Address removed successfully';
          break;
      }

      // 4. Apply the update
      const updatedUser = await this.userModel
        .findOneAndUpdate({ email }, updateOperation, { new: true, session })
        .select('addresses')
        .lean();

      await session.commitTransaction();

      return {
        statusCode: 200,
        message: responseMessage,
        data: {
          addresses: updatedUser!.addresses,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error updating address:', error);
      return {
        statusCode: 500,
        message: 'Failed to update address',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }
  async reviewUpdate({
    email,
    reviewId,
    review,
  }: {
    email: string;
    reviewId: string;
    review: UpdateReviewDTO;
  }): Promise<{ statusCode: number; message: string; data?: any }> {
    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      if (!Types.ObjectId.isValid(reviewId)) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid review ID format',
        };
      }

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid email format',
        };
      }

      if (!review || Object.keys(review).length === 0) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Review update data is required',
        };
      }

      //verify user exists and owns the review
      const user = await this.userModel
        .findOne({ email, reviews: reviewId })
        .select('_id')
        .session(session)
        .lean();

      if (!user) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'User not found or review does not belong to user',
        };
      }

      const updateObj: any = { lastUpdateAt: new Date() };
      const allowedFields = [
        'rating',
        'title',
        'description',
        'imageLinks',
        'tags',
      ];
      const restrictedFields = ['_id', 'userEmail', 'userName', 'product'];

      Object.keys(review).forEach((key) => {
        if (
          allowedFields.includes(key) &&
          !restrictedFields.includes(key) &&
          review[key] !== undefined
        ) {
          updateObj[key] = review[key];
        }
      });

      // update the review (atomic operation)
      const updatedReview = await this.reviewModel
        .findOneAndUpdate(
          { _id: reviewId },
          { $set: updateObj },
          { new: true, session },
        )
        .select('-__v') // Exclude version key
        .lean();

      if (!updatedReview) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'Review not found',
        };
      }

      await session.commitTransaction();

      return {
        statusCode: 200,
        message: 'Review updated successfully',
        data: updatedReview,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error updating review:', error);
      return {
        statusCode: 500,
        message: 'Failed to update review',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }

  async reviewCreate({
    email,
    review,
  }: {
    email: string;
    review: CreateReviewDTO;
  }): Promise<{ statusCode: number; message: string; data?: any }> {
    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid email format',
        };
      }

      if (
        !review ||
        !review.product ||
        !Types.ObjectId.isValid(review.product)
      ) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Valid product ID is required',
        };
      }

      if (review.userEmail !== email) {
        await session.abortTransaction();
        return {
          statusCode: 403,
          message: 'Review userEmail and authenticated email do not match',
        };
      }

      const user = await this.userModel
        .findOne({ email })
        .select('_id reviews')
        .session(session);

      if (!user) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }

      const existingReview = await this.reviewModel
        .findOne({ userEmail: email, product: review.product })
        .session(session)
        .lean();

      if (existingReview) {
        await this.reviewModel
          .deleteOne({ _id: existingReview._id })
          .session(session);

        user.reviews = user.reviews.filter(
          (id) => !id.equals(existingReview._id),
        );
      }

      const newReview = await this.reviewModel.create(
        [
          {
            ...review,
            createdAt: new Date(),
            lastUpdateAt: new Date(),
          },
        ],
        { session },
      );

      user.reviews.push(newReview[0]._id);
      await user.save({ session });

      await session.commitTransaction();

      return {
        statusCode: 201,
        message: 'Review created successfully',
        data: {
          reviewId: newReview[0]._id,
          productId: review.product,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating review:', error);
      return {
        statusCode: 500,
        message: 'Failed to create review',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }

  async reviewDelete({
    email,
    review,
  }: {
    email: string;
    action: string;
    review: UpdateReviewDTO;
  }) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        // throw new NotFoundException('User not found');
        return {
          statusCode: 404,
          message: 'user not found',
        };
      }
      if (review.userEmail != email) {
        return {
          statusCode: 403,
          message: 'review userEmail and email dont match',
        };
      }
      const exists = await this.reviewModel
        .findOne({ userEmail: email, product: review.product })
        .exec();
      if (!exists) {
        return {
          statusCode: 403,
          message: 'review userEmail and email dont match',
        };
      }
      await this.reviewModel
        .deleteOne({ userEmail: email, product: review.product })
        .exec();
      return {
        statusCode: 200,
        message: 'OK',
      };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to update user review');
    }
  }

  //shopping List

  async getALLShoppingList(email: string) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }
      const userDetails = { ...user.toObject() } as any;
      const shoppingListIds = user.shoppingLists;
      const lists = await this.shoppingListModel
        .find({ _id: { $in: shoppingListIds } })
        .exec();
      console.log(lists);
      const listsWithoutItems = lists.map((list) => {
        const { items, ...rest } = list.toObject();
        return rest;
      });
      // if whole user needs to be returned
      // const userWithOrders = {
      //   ...user.toObject(),
      //   orders: listsWithoutItems,
      // };
      // console.log(userWithOrders)
      return listsWithoutItems;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }
  //just returning list with unpopulated items  , leaving populating item responsibility on frontend as user scrolls for efficiency
  async getShoppingList(
    email: string,
    id: string,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return {
          statusCode: 400,
          message: 'Invalid shopping list ID format',
        };
      }

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return {
          statusCode: 400,
          message: 'Invalid email format',
        };
      }

      const userExists = await this.userModel.exists({ email }).lean();
      if (!userExists) {
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }
      const shoppingList = await this.shoppingListModel
        .findOne({ _id: id, email })
        .select('_id email name description items createdAt updatedAt') // Explicitly select fields
        .lean();

      if (!shoppingList) {
        return {
          statusCode: 404,
          message: 'Shopping list not found',
        };
      }
      return {
        statusCode: 200,
        message: 'Shopping list retrieved successfully',
        data: {
          ...shoppingList,
          items: shoppingList.items.map((item) => ({
            product: item.product.toString(), // Convert ObjectId to string
            timeAdded: item.timeAdded,
          })),
        },
      };
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      return {
        statusCode: 500,
        message: 'Failed to fetch shopping list',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    }
  }

  async shoppingListCreate({
    email,
    name,
    description,
  }: {
    email: string;
    name: string;
    description?: string;
  }) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }
      const exists = await this.shoppingListModel
        .findOne({ email: email, name: name })
        .exec();
      if (exists) {
        return {
          statusCode: 400,
          message: 'a shopping list with same name already exists',
        };
      }
      const newList = await this.shoppingListModel.create({
        name: name,
        email: email,
        description: description,
        items: [],
      });
      user.shoppingLists.push(newList.id);
      await user.save();
      return {
        statusCode: 200,
        message: 'OK',
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async shoppingListRemove(email: string, id: string) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }
      const exists = await this.shoppingListModel
        .findOne({ email: email, _id: id })
        .exec();
      if (!exists) {
        return {
          statusCode: 400,
          message: 'shopping list does not exists.',
        };
      }
      await this.shoppingListModel.deleteOne({ email: email, _id: id }).exec();

      for (let i = 0; i < user.shoppingLists.length; i++) {
        if (user.shoppingLists[i].equals(id)) {
          user.shoppingLists.splice(i, 1);
          await user.save();
          break;
        }
      }
      return {
        statusCode: 200,
        message: 'OK',
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async shoppingListMetaUpdate(
    email: string,
    listId: string,
    description?: string,
  ) {
    //for updating descriptions,
  }
  //not useful since quantity cant be set in shopping list
  async ShoppingListToCart(
    email: string,
    listId: string,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    const session = await this.cartModel.startSession();
    session.startTransaction();

    try {
      // 1. Validate inputs
      if (!Types.ObjectId.isValid(listId)) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid shopping list ID format',
        };
      }

      // 2. Verify user exists
      const user = await this.userModel
        .findOne({ email })
        .select('_id email')
        .session(session)
        .lean();

      if (!user) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }

      // 3. Get shopping list with items
      const shoppingList = await this.shoppingListModel
        .findOne({ _id: listId, email })
        .select('items')
        .populate('items.product', '_id')
        .session(session)
        .lean();

      if (!shoppingList) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'Shopping list not found',
        };
      }

      if (shoppingList.items.length === 0) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Shopping list is empty',
        };
      }

      // 4. Prepare cart items (merge duplicates and set quantity to 1)
      const cartItemsMap = new Map<
        string,
        { product: Types.ObjectId; quantity: number }
      >();

      shoppingList.items.forEach((item) => {
        const productId = item.product._id.toString();
        if (cartItemsMap.has(productId)) {
          const existing = cartItemsMap.get(productId);
          cartItemsMap.set(productId, {
            product: item.product._id,
            quantity: existing!.quantity + 1,
          });
        } else {
          cartItemsMap.set(productId, {
            product: item.product._id,
            quantity: 1,
          });
        }
      });

      const cartItems = Array.from(cartItemsMap.values());

      // 5. Find or create cart and update
      let cart = await this.cartModel.findOne({ email }).session(session);

      if (!cart) {
        cart = await this.cartModel.create(
          [
            {
              email: user.email,
              items: cartItems,
              updatedAt: new Date(),
            },
          ],
          { session },
        )[0];

        await this.userModel.findByIdAndUpdate(
          user._id,
          { $set: { cart: cart?._id } },
          { session },
        );
      } else {
        // Merge existing cart items with shopping list items
        const existingItemsMap = new Map<
          string,
          { product: Types.ObjectId; quantity: number }
        >();

        cart.items.forEach((item) => {
          existingItemsMap.set(item.product.toString(), {
            product: item.product,
            quantity: item.quantity,
          });
        });

        cartItems.forEach((item) => {
          const productId = item.product.toString();
          if (existingItemsMap.has(productId)) {
            existingItemsMap.get(productId)!.quantity += item.quantity;
          } else {
            existingItemsMap.set(productId, item);
          }
        });

        const mergedItems = Array.from(existingItemsMap.values());

        cart = await this.cartModel.findOneAndUpdate(
          { _id: cart._id },
          {
            $set: {
              items: mergedItems,
              updatedAt: new Date(),
            },
          },
          { new: true, session },
        );
      }

      await session.commitTransaction();

      // 6. Get populated cart data
      const populatedCart = await this.cartModel
        .findById(cart?._id)
        .populate('items.product', '_id name price images')
        .lean();

      return {
        statusCode: 200,
        message: 'Shopping list items added to cart successfully',
        data: populatedCart,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error transferring shopping list to cart:', error);
      return {
        statusCode: 500,
        message: 'Failed to transfer shopping list to cart',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }

  async shoppingListAddItem(
    email: string,
    listId: string,
    productId: string,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    // Validate input IDs first
    if (!Types.ObjectId.isValid(listId) || !Types.ObjectId.isValid(productId)) {
      return {
        statusCode: 400,
        message: 'Invalid ID format',
      };
    }

    const session = await this.shoppingListModel.startSession();
    session.startTransaction();

    try {
      // 1. Verify user exists
      const userExists = await this.userModel
        .exists({ email })
        .session(session);
      if (!userExists) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }

      // 2. Get the shopping list (need full document for modification)
      const shoppingList = await this.shoppingListModel
        .findOne({ _id: listId, email })
        .session(session);

      if (!shoppingList) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'Shopping list not found',
        };
      }

      // 3. Convert productId to ObjectId for comparison
      const productObjectId = new Types.ObjectId(productId);

      // 4. Check for existing item
      const itemExists = shoppingList.items.some(
        (item) => item.product.toString() === productObjectId.toString(),
      );

      if (itemExists) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Item already exists in the list',
        };
      }

      // 5. Add new item
      shoppingList.items.push({
        product: productObjectId,
        timeAdded: new Date(),
      });
      // shoppingList.updatedAt = new Date();
      await shoppingList.save({ session });

      await session.commitTransaction();

      return {
        statusCode: 200,
        message: 'Item added successfully',
        data: {
          items: shoppingList.items,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error in shoppingListAddItem:', error);

      return {
        statusCode: 500,
        message: 'Failed to add item to shopping list',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }

  async shoppingListDeleteItem(
    email: string,
    listId: string,
    productId: string,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    if (!Types.ObjectId.isValid(listId) || !Types.ObjectId.isValid(productId)) {
      return {
        statusCode: 400,
        message: 'Invalid ID format',
      };
    }

    const session = await this.shoppingListModel.startSession();
    session.startTransaction();

    try {
      // 1. Verify user exists
      const userExists = await this.userModel
        .exists({ email })
        .session(session);
      if (!userExists) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }

      const shoppingList = await this.shoppingListModel
        .findOne({ _id: listId, email })
        .session(session);

      if (!shoppingList) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'Shopping list not found',
        };
      }

      const productObjectId = new Types.ObjectId(productId);

      const initialLength = shoppingList.items.length;
      shoppingList.items = shoppingList.items.filter(
        (item) => item.product.toString() !== productObjectId.toString(),
      );

      if (shoppingList.items.length === initialLength) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Product not found in the list',
        };
      }

      // shoppingList.updatedAt = new Date();
      await shoppingList.save({ session });

      await session.commitTransaction();

      return {
        statusCode: 200,
        message: 'Item removed successfully',
        data: {
          items: shoppingList.items,
        },
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error in shoppingListDeleteItem:', error);

      return {
        statusCode: 500,
        message: 'Failed to remove item from shopping list',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }

  ////////////////////////////////////////
  //cart related stuff
  async getCart(
    email: string,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    try {
      //  Validate email format
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return {
          statusCode: 400,
          message: 'Invalid email format',
        };
      }

      //check user exist
      const userExists = await this.userModel.exists({ email }).lean();
      if (!userExists) {
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }

      //
      const cart = await this.cartModel
        .findOne({ email })
        .populate({
          path: 'items.product',
          model: 'Product',
          select: '_id name price imageLinks', // Only include necessary fields
        })
        .lean();

      if (!cart) {
        return {
          statusCode: 200,
          message: 'Cart is empty',
          data: { items: [] },
        };
      }

      // Transform the cart data
      const transformedCart = {
        ...cart,
        items: cart.items.map((item) => ({
          ...item,
          product: item.product || null, // Handle cases where product might be deleted
        })),
      };

      return {
        statusCode: 200,
        message: 'Cart retrieved successfully',
        data: transformedCart,
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return {
        statusCode: 500,
        message: 'Failed to fetch cart',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    }
  }
  async clearCart(
    email: string,
  ): Promise<{ statusCode: number; message: string; data?: any }> {
    const session = await this.cartModel.startSession();
    session.startTransaction();

    try {
      // 1. Validate email format
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid email format',
        };
      }

      // 2. Verify user exists (lean query for performance)
      const user = await this.userModel
        .findOne({ email })
        .select('_id email')
        .session(session)
        .lean();

      if (!user) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }

      // 3. Find and clear the cart (atomic operation)
      const result = await this.cartModel
        .findOneAndUpdate(
          { email },
          { $set: { items: [], updatedAt: new Date() } },
          { new: true, session },
        )
        .lean();

      if (!result) {
        // 4. Create new empty cart if none exists
        const newCart = await this.cartModel.create(
          [
            {
              email: user.email,
              items: [],
              updatedAt: new Date(),
            },
          ],
          { session },
        );

        await this.userModel.findByIdAndUpdate(
          user._id,
          { $set: { cart: newCart[0]._id } },
          { session },
        );

        await session.commitTransaction();
        return {
          statusCode: 200,
          message: 'Cart created and cleared successfully',
          data: { items: [] },
        };
      }

      await session.commitTransaction();
      return {
        statusCode: 200,
        message: 'Cart cleared successfully',
        data: { items: [] },
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error clearing cart:', error);
      return {
        statusCode: 500,
        message: 'Failed to clear cart',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }
  async cartUpdate({
    email,
    productId,
    quantity = 1,
    action,
  }: {
    email: string;
    productId: string;
    quantity?: number;
    action: string;
  }): Promise<{ statusCode: number; message: string; data?: any }> {
    const session = await this.cartModel.startSession();
    session.startTransaction();

    try {
      // 1. Validate inputs
      if (!Types.ObjectId.isValid(productId)) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid product ID format',
        };
      }

      if (
        !['add', 'set', 'increment', 'decrement', 'remove'].includes(action)
      ) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid action specified',
        };
      }

      if (action === 'set' && (typeof quantity !== 'number' || quantity < 1)) {
        await session.abortTransaction();
        return {
          statusCode: 400,
          message: 'Invalid quantity for set action',
        };
      }

      // 2. Verify user exists
      const user = await this.userModel
        .findOne({ email })
        .select('_id email')
        .session(session)
        .lean();

      if (!user) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'User not found',
        };
      }

      // 3. Find or create cart
      let cart = await this.cartModel.findOne({ email }).session(session);

      if (!cart) {
        cart = await this.cartModel.create(
          [
            {
              email: user.email,
              items: [],
              updatedAt: new Date(),
            },
          ],
          { session },
        )[0];

        await this.userModel.findByIdAndUpdate(
          user._id,
          { $set: { cart: cart?._id } },
          { session },
        );
      }

      const productObjectId = new Types.ObjectId(productId);
      const existingItemIndex = cart?.items.findIndex((item) =>
        item.product.equals(productObjectId),
      );

      if (!(existingItemIndex && cart?.items)) {
        await session.abortTransaction();
        return {
          statusCode: 404,
          message: 'Either cart is empty or item not found',
        };
      }

      // 4. Handle different actions
      let updateOperation;
      let responseMessage = 'Cart updated successfully';

      switch (action) {
        case 'add':
          if (existingItemIndex >= 0) {
            updateOperation = {
              $inc: { [`items.${existingItemIndex}.quantity`]: quantity },
            };
          } else {
            updateOperation = {
              $push: {
                items: {
                  product: productObjectId,
                  quantity: quantity,
                  addedAt: new Date(),
                },
              },
            };
          }
          break;

        case 'set':
          if (existingItemIndex >= 0) {
            updateOperation = {
              $set: { [`items.${existingItemIndex}.quantity`]: quantity },
            };
          } else {
            updateOperation = {
              $push: {
                items: {
                  product: productObjectId,
                  quantity: quantity,
                  addedAt: new Date(),
                },
              },
            };
          }
          break;

        case 'increment':
          if (existingItemIndex >= 0) {
            updateOperation = {
              $inc: { [`items.${existingItemIndex}.quantity`]: 1 },
            };
          } else {
            updateOperation = {
              $push: {
                items: {
                  product: productObjectId,
                  quantity: 1,
                  addedAt: new Date(),
                },
              },
            };
          }
          break;

        case 'decrement':
          if (existingItemIndex >= 0) {
            if (cart?.items[existingItemIndex].quantity <= 1) {
              updateOperation = {
                $pull: { items: { product: productObjectId } },
              };
              responseMessage = 'Item removed from cart (quantity was 1)';
            } else {
              updateOperation = {
                $inc: { [`items.${existingItemIndex}.quantity`]: -1 },
              };
            }
          } else {
            await session.abortTransaction();
            return {
              statusCode: 404,
              message: 'Item not found in cart',
            };
          }
          break;

        case 'remove':
          if (existingItemIndex >= 0) {
            updateOperation = {
              $pull: { items: { product: productObjectId } },
            };
          } else {
            await session.abortTransaction();
            return {
              statusCode: 404,
              message: 'Item not found in cart',
            };
          }
          break;
      }

      // 5. Apply the update
      const updatedCart = await this.cartModel
        .findOneAndUpdate(
          { _id: cart?._id },
          {
            ...updateOperation,
            $set: { updatedAt: new Date() },
          },
          { new: true, session },
        )
        .populate('items.product', '_id name price imageLinks')
        .lean();

      await session.commitTransaction();

      return {
        statusCode: 200,
        message: responseMessage,
        data: updatedCart,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error updating cart:', error);
      return {
        statusCode: 500,
        message: 'Failed to update cart',
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      };
    } finally {
      session.endSession();
    }
  }
  async orderUpdate() {
    //request changes in order done by  user like cancel, return, replace
  }

  async cartBuy() {
    //allows to buy all items of cart , after order is generated cart is discarded/deleted
  }

  async cartBuyDirect() {
    //allows to buy single item directly, for buy now
  }
}
