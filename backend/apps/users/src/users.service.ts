import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose, Types } from 'mongoose';
import { User } from './../../libs/shared/schemas/user.schema';
import { CreateUserDto } from 'apps/libs/shared/dto/create/createUser.dto';
import { Order } from 'apps/libs/shared/schemas/order.schema';
import { Product } from 'apps/libs/shared/schemas/product.schema';
import { ShoppingList } from 'apps/libs/shared/schemas/shoppingList.schema';
import { Cart } from 'apps/libs/shared/schemas/cart.schema';
import { console } from 'inspector';
import { ifError } from 'assert';
import { retry } from 'rxjs';
import { AddressDTO } from 'apps/libs/shared/dto/common/address.dto';
import { CreateReviewDTO } from 'apps/libs/shared/dto/create/createReview.dto';
import { UpdateReviewDTO } from 'apps/libs/shared/dto/update/updateReview.dto';
import { Review } from 'apps/libs/shared/schemas/review.schema';
import { EachMessageHandler } from '@nestjs/microservices/external/kafka.interface';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
    @InjectModel('ShoppingList') private readonly shoppingListModel: Model<ShoppingList>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Review') private readonly reviewModel: Model<Review>
  ) { }

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
      return await newUser.save();
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
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

  async addressUpdate({ email, action, address }: { email: string; action: string; address?: AddressDTO }) {
    // add/edit/delete addresses, max addresses some constant like 10
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        return {
          statusCode: 404,
          message: "user not found"
        };
      }
      switch (action) {
        case "update":
        case "create": {
          if (!address) {
            return {
              statusCode: 400,
              message: "invalid address, failed"
            }
          }
          let check = 0;
          user.addresses.forEach(async (item, index) => {
            if (item.name == address?.name) {
              user.addresses[index] = address;
              check = 1
            }
          })
          if (!check) user.addresses.push(address)
          await user.save();
        };
        case "remove": {
          let check = 0, ind = -1;
          if (address) {
            user.addresses.forEach(async (item, index) => {
              if (item.name == address?.name) {
                check = 1;
                ind = index;
              }
            })
            if (check != -1) {
              user.addresses.splice(ind, 1);
              await user.save();
              return {
                statusCode: 200,
                message: "OK"
              }
            }
          }
        };
        default: {
          return {
            statusCode: 400,
            message: "invalid action"
          }
        }
      }
    }
    catch (error) {
      Logger.error('Error fetching user orders:', error);
      throw new InternalServerErrorException('Failed to fetch user cart');
    }
  }

  async reviewUpdate({ email, reviewId, review }: { email: string; reviewId: string; review: UpdateReviewDTO }) {
    //edit reviews, 1 review per product
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        // throw new NotFoundException('User not found');
        return {
          statusCode: 404,
          message: "user not found"
        };
      }
      let check = 0;
      for (let i = 0; i < user.reviews.length; i++) {
        if (user.reviews[i].equals(reviewId)) {
          check = 1;
          const oldRev = await this.reviewModel.findOne({ _id: reviewId }).exec();
          if (!oldRev) {
            return {
              statusCode: 404,
              message: "review not found"
            }
          }
          Object.keys(review).forEach((key) => {
            if (review[key] !== undefined && review[key] != "_id" && review[key] != "userEmail" && review[key] != "userName" && review[key] != "product") {
              oldRev[key] = review[key];
            }
          });
          oldRev.lastUpdateAt = new Date();
          await oldRev.save()
          return {
            statusCode: 200,
            message: "OK"
          }
        }
      }
      if (!check) {
        return {
          statusCode: 404,
          message: "review not found for this user."
        }
      }
    }
    catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to update user review');
    }
  }

  async reviewCreate({ email, review }: { email: string; action: string; review: CreateReviewDTO }) {
    //create review, 1 review per product
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (review.userEmail != email) {
        return {
          statusCode: 403,
          message: "review userEmail and email dont match"
        }
      }
      if (!user) {
        // throw new NotFoundException('User not found');
        return {
          statusCode: 404,
          message: "user not found"
        };
      }
      const exists = await this.reviewModel.findOne({ userEmail: email, product: review.product }).exec();
      if (exists) {
        Logger.error("fatal error 2 or more review by same user for same product.")
        await this.reviewModel.deleteMany({ userEmail: email, product: review.product }).exec();
      }
      const newReview = await this.reviewModel.create(review);
      user.reviews.push(newReview._id);
      await user.save();
      return {
        statusCode: 200,
        message: "OK"
      }
    }
    catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to update user review');
    }
  }

  async reviewDelete({ email, review }: { email: string; action: string; review: UpdateReviewDTO }) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        // throw new NotFoundException('User not found');
        return {
          statusCode: 404,
          message: "user not found"
        };
      }
      if (review.userEmail != email) {
        return {
          statusCode: 403,
          message: "review userEmail and email dont match"
        }
      }
      const exists = await this.reviewModel.findOne({ userEmail: email, product: review.product }).exec();
      if (!exists) {
        return {
          statusCode: 403,
          message: "review userEmail and email dont match"
        }
      }
      await this.reviewModel.deleteOne({ userEmail: email, product: review.product }).exec();
      return {
        statusCode: 200,
        message: "OK"
      }
    }
    catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to update user review');
    }
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
  async getShoppingList(email: string, id: string) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }
      const shoppingList = await this.shoppingListModel.findOne({ _id: id, email: email }).exec();
      return shoppingList?.toObject();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async shoppingListCreate({ email, name, description }: { email: string; name: string; description?: string }) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }
      const exists = await this.shoppingListModel.findOne({ email: email, name: name }).exec();
      if (exists) {
        return {
          statusCode: 400,
          message: "a shopping list with same name already exists"
        }
      }
      const newList = await this.shoppingListModel.create({ name: name, email:email,description: description, items: [] });
      user.shoppingLists.push(newList.id);
      await user.save();
      return {
        statusCode: 200,
        message: "OK"
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async shoppingListRemove(email:string, id:string) {
    
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }
      const exists = await this.shoppingListModel.findOne({ email: email, _id:id }).exec();
      if (!exists) {
        return {
          statusCode: 400,
          message: "shopping list does not exists."
        }
      }
      await this.shoppingListModel.deleteOne({ email: email, _id:id }).exec();
      
      for(let i=0; i<user.shoppingLists.length;i++){
        if(user.shoppingLists[i].equals(id)){
            user.shoppingLists.splice(i,1);
            await user.save();
            break;
          }
        }
      return {
        statusCode: 200,
        message: "OK"
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async shoppingListMetaUpdate(email:string ,listId:string, description?: string) {
    //for updating descriptions,
  }
  //not useful since quantity cant be set in shopping list
  // async ShoppingListToCart() {
  //   //for adding all items of a shopping list to cart
  //   // deletes cart then add items
  // }

  async shoppingListAddItem(email:string ,listId:string, product: string) {
    //for adding products 
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }
      const exists = await this.shoppingListModel.findOne({ email: email, _id:listId }).exec();
      
      if (!exists) {
        return {
          statusCode: 400,
          message: "shopping list does not exists."
        }
      }
      const existingItem =exists.items.find((item,index)=>{item.product.equals(product)})
      if(existingItem){
        return{
           statusCode: 400,
        message: "item already in the list"
        }
      }
      const oid = new Types.ObjectId(product)
      exists.items.push({product: oid, timeAdded:new Date() });
      
      await exists.save();
      return {
        statusCode: 200,
        message: "OK"
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }

  async shoppingListDeleteItem(email:string ,listId:string, product: string) {
    //for  deleting products
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
        //  return null;
      }
      const exists = await this.shoppingListModel.findOne({ email: email, _id:listId }).exec();
      
      if (!exists) {
        return {
          statusCode: 400,
          message: "shopping list does not exists."
        }
      }
   
      const existingItem =exists.items.findIndex((item,index)=>{item.product.equals(product)})
      if(existingItem==-1){
        return{
           statusCode: 400,
        message: "product not in the list"
        }
      }
      
      exists.items.splice(existingItem,1);
      await exists.save();
      return {
        statusCode: 200,
        message: "OK"
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new InternalServerErrorException('Failed to fetch user');
      // return null;
    }
  }
  
  
  ////////////////////////////////////////
  //cart related stuff
  async getCart(email: String) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      // Logger.log(user);
      const cart = await this.cartModel.findOne({ email: email }).exec();
      const filledCart = cart as any
      for (let i = 0; i < cart!.items.length || 0; i++) {
        const id = cart!.items[i].product;
        const p = await this.ProductModel.findOne({ _id: cart?.items[i].product }).exec()
        filledCart.items[i].product = p;
      }
      Logger.log(cart);
      return filledCart;
      if (!user) {
        // throw new NotFoundException('User not found');
        return null;
      }
    }
    catch (error) {
      Logger.error('Error fetching user orders:', error);
      throw new InternalServerErrorException('Failed to fetch user cart');
    }
  }

  async clearCart(email: string) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      // Logger.log(user);
      if (!user) {
        // throw new NotFoundException('User not found');
        return {
          statusCode: 404,
          message: "user not found"
        };
      }
      const cart = await this.cartModel.findOne({ email: email }).exec();
      if (!cart) {
        Logger.error("fatal user cart found null");
        const newCart = await this.cartModel.create({ user: user.name, email: user.email })
        user.cart = newCart._id;
        return {
          statusCode: 404,
          message: "user not found"
        };
      }
      cart!.items = []
      return;
    }
    catch (error) {
      Logger.error('Error fetching user orders:', error);
      throw new InternalServerErrorException('Failed to fetch user cart');
    }
  }

  async cartUpdate({ email, productId, quantity, action }: { email: string; productId: string; quantity?: number, action: string }) {
    //for adding  a product to cart for first time or incrementing/decrementing it, or removing a product/all product
    // the action is supplied as string in json obj
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      // Logger.log(user);
      if (!user) {
        // throw new NotFoundException('User not found');
        return {
          statusCode: 404,
          message: "user not found"
        };
      }
      const cart = await this.cartModel.findOne({ email: email }).exec();
      if (!cart) {
        Logger.error("fatal user cart found null");
        const newCart = await this.cartModel.create({ user: user.name, email: user.email })
        user.cart = newCart._id;
        return {
          statusCode: 200,
          message: "cart empty"
        };
      }
      let check = 0, index = 0;
      for (let i = 0; i < cart.items.length; i++) {
        if (cart.items[i].product.equals(productId)) {
          check = 1;
          index = i;
        }
        break;
      }
      if (!check) {
        return {
          statusCode: 404,
          message: "item not in user cart"
        };
      }
      switch (action) {
        case "increment": {
          cart.items[index].quantity = cart.items[index].quantity + 1;
          break;
        }
        case "decrement": {
          if (cart.items[index].quantity > 1) {
            cart.items[index].quantity = cart.items[index].quantity - 1;
          }
          else {
            return {
              statusCode: 403,
              message: "can't decrement below 1"
            }
          }
          break;
        }
        case "add": {
          if (!quantity || quantity < 0) return {
            statusCode: 403,
            message: "invalid quantity"
          }
          else {
            const q = parseInt(quantity.toString());
            cart.items[index].quantity = cart.items[index].quantity + quantity;
          }
          break;
        }
        case "set": {
          if (!quantity || quantity < 0) return {
            statusCode: 403,
            message: "invalid quantity"
          }
          else {
            const q = parseInt(quantity.toString());
            cart.items[index].quantity = quantity;
          }
          break;
        }
        case "remove": {
          cart.items.splice(index, 1);
          break;
        }
        default: {
          return {
            statusCode: 400,
            message: "invalid action"
          }
        }
      }
      await cart.save();
      return {
        statusCode: 200
      }
    }
    catch (error) {
      Logger.error('Error fetching user orders:', error);
      throw new InternalServerErrorException('Failed to fetch user cart');
    }
  }

  async cartBuy() {
    //allows to buy all items of cart , after order is generated cart is discarded/deleted
  }

  async cartBuyDirect() {
    //allows to buy single item directly, for buy now
  }
}
