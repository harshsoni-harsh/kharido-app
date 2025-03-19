import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose } from 'mongoose';
import { User } from './../../libs/shared/schemas/user.schema';
import { CreateUserDto } from 'apps/libs/shared/dto/create/createUser.dto';

import { Order } from 'apps/libs/shared/schemas/order.schema';
import { Product } from 'apps/libs/shared/schemas/product.schema';
import { ShoppingList } from 'apps/libs/shared/schemas/shoppingList.schema';
import { Cart } from 'apps/libs/shared/schemas/cart.schema';
import { console } from 'inspector';

@Injectable()
export class UsersService {
  // constructor(@InjectConnection() private readonly connection: Connection) {}

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
    @InjectModel('ShoppingList')
    private readonly shoppingListModel: Model<ShoppingList>,
    // @InjectModel('Cart') private readonly cartModel : Model<Cart>
  ) {}

  /////////////////////////////////////
  //handles user updates

  async getUserMeta(email: string) {
    //just returns the user name, email,gender,role,createdAt, not the nested objects
    try {
      const user = await this.userModel.findOne({ email: email }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }

      const userDetails = { ...user.toObject() } as any;

      delete userDetails.cart;
      delete userDetails._id;
      delete userDetails.shoppingLists;
      delete userDetails.orders;
      delete userDetails.reviews;

      return userDetails;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userData = {
        name: createUserDto.name,
        email: createUserDto.email,
        gender: createUserDto.gender,
        addresses: createUserDto.addresses,
        role: 'user',
      };
      const newUser = new this.userModel(userData);
      console.log('hi', newUser);
      return await newUser.save();
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  //////////////////////////
  //product related

  /////////////////////
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
        const { items, _id, ...rest } = order.toObject();
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

  async getCart(email: string) {
    console.log('kkkk');
    // const user = await this.userModel.findOne({ email }).exec();
    return 'h';
  }

  async addressUpdate() {
    // add/edit/delete addresses, max addresses some constant like 10
  }

  async reviewsUpdate() {
    //create/edit/delete reviews, 1 review per product
  }

  async orderUpdate() {
    //request changes in order done by  user like cancel, return, replace
  }

  ////////////////////////////////////
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

      const ordersWithoutItems = lists.map((list) => {
        const { items, _id, ...rest } = list.toObject();
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
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async getShoppingList(email: string, id: string) {
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

      const ordersWithoutItems = lists.map((list) => {
        const { items, _id, ...rest } = list.toObject();
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
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async shoppingListCreate() {
    //for creating a list
  }

  async shoppingListMetaUpdate() {
    //for updating descriptions, name etc
  }

  async ShoppingListToCart() {
    //for adding all items of a shopping list to cart
    // deletes cart then add items
  }

  async shoppingListUpdate() {
    //for adding products or deleting
  }

  ////////////////////////////////////////
  //cart related stuff
  async cartUpdate() {
    //for adding  a product to cart for first time or incrementing/decrementing it, or removing a product/all product
    // the action is supplied as string in json obj

    console.log('jo');
    // return "hi bro"
  }

  async cartBuy() {
    //allows to buy all items of cart , after order is generated cart is discarded/deleted
  }

  async cartBuyDirect() {
    //allows to buy single item directly, for buy now
  }
}
