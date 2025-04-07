import { Controller, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@shared/dto/create/createUser.dto';
import { AddressDTO } from '@shared/dto/common/address.dto';
import { CreateReviewDTO } from '@shared/dto/create/createReview.dto';
import { UpdateReviewDTO } from '@shared/dto/update/updateReview.dto';


@Controller()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern('USER_GET_META')
  async getUserMeta(@Payload() email: string) {
    return this.userService.getUserMeta(email);
  }

  @MessagePattern('USER_CREATE')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @MessagePattern('USER_GET_ALL_ORDERS_META')
  async getAllOrdersMeta(@Payload() email: string) {
    return this.userService.getAllOrdersMeta(email);
  }

  @MessagePattern('USER_GET_ORDER')
  async getOrder(@Payload() payload: { email: string; id: string }) {
    return this.userService.getOrder(payload.email, payload.id);
  }

  @MessagePattern('USER_ADDRESS_UPDATE')
  async addressUpdate(@Payload() payload: { email: string; action: string; address?: AddressDTO }) {
    return this.userService.addressUpdate(payload);
  }

  @MessagePattern('USER_REVIEW_UPDATE')
  async reviewUpdate(@Payload() payload: { email: string; reviewId: string; review: UpdateReviewDTO }) {
    return this.userService.reviewUpdate(payload);
  }

  @MessagePattern('USER_REVIEW_CREATE')
  async reviewCreate(@Payload() payload: { email: string; action: string; review: CreateReviewDTO }) {
    return this.userService.reviewCreate(payload);
  }

  @MessagePattern('USER_REVIEW_DELETE')
  async reviewDelete(@Payload() payload: { email: string; action: string; review: UpdateReviewDTO }) {
    return this.userService.reviewDelete(payload);
  }

  @MessagePattern('USER_GET_ALL_SHOPPING_LISTS')
  async getALLShoppingList(@Payload() email: string) {
    return this.userService.getALLShoppingList(email);
  }

  @MessagePattern('USER_GET_SHOPPING_LIST')
  async getShoppingList(@Payload() payload: { email: string; id: string }) {
    return this.userService.getShoppingList(payload.email, payload.id);
  }

  @MessagePattern('USER_SHOPPING_LIST_CREATE')
  async shoppingListCreate(@Payload() payload: { email: string; name: string; description?: string }) {
    return this.userService.shoppingListCreate(payload);
  }

  @MessagePattern('USER_SHOPPING_LIST_REMOVE')
  async shoppingListRemove(@Payload() payload: { email: string; id: string }) {
    return this.userService.shoppingListRemove(payload.email, payload.id);
  }

  @MessagePattern('USER_SHOPPING_LIST_ADD_ITEM')
  async shoppingListAddItem(@Payload() payload: { email: string; listId: string; product: string }) {
    return this.userService.shoppingListAddItem(payload.email, payload.listId, payload.product);
  }

  @MessagePattern('USER_SHOPPING_LIST_DELETE_ITEM')
  async shoppingListDeleteItem(@Payload() payload: { email: string; listId: string; product: string }) {
    return this.userService.shoppingListDeleteItem(payload.email, payload.listId, payload.product);
  }

  @MessagePattern('USER_GET_CART')
  async getCart(@Payload() email: string) {
    return this.userService.getCart(email);
  }

  @MessagePattern('USER_CLEAR_CART')
  async clearCart(@Payload() email: string) {
    return this.userService.clearCart(email);
  }

  @MessagePattern('USER_CART_UPDATE')
  async cartUpdate(@Payload() payload: { 
    email: string; 
    productId: string; 
    quantity?: number; 
    action: string 
  }) {
    return this.userService.cartUpdate(payload);
  }

  @MessagePattern('USER_ORDER_UPDATE')
  async orderUpdate(@Payload() payload: {
    orderId: string;
    action: 'cancel' | 'return' | 'replace';
    reason?: string;
  }) {
    Logger.log(`Received order update request`, payload);
    return this.userService.orderUpdate(payload);
  }

  @MessagePattern('USER_CART_BUY')
  async cartBuy(@Payload() payload: {
    email: string;
    paymentMode: string;
    address: AddressDTO;
  }) {
    Logger.log(`Received cart buy request`, { 
      email: payload.email,
      paymentMode: payload.paymentMode 
    });
    return this.userService.cartBuy(payload);
  }

  @MessagePattern('USER_CART_BUY_DIRECT')
  async cartBuyDirect(@Payload() payload: {
    email: string;
    productId: string;
    quantity?: number;
    paymentMode: string;
    address: AddressDTO;
  }) {
    Logger.log(`Received direct buy request`, {
      email: payload.email,
      productId: payload.productId
    });
    return this.userService.cartBuyDirect(payload);
  }
}
