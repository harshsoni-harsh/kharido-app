import { AddressDTO } from '@libs/shared/dto/common/address.dto';
import { CreateReviewDTO } from '@libs/shared/dto/create/createReview.dto';
import { CreateUserDto } from '@libs/shared/dto/create/createUser.dto';
import { UpdateReviewDTO } from '@libs/shared/dto/update/updateReview.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class UsersService {
  constructor(@Inject('USERS_CLIENT') private readonly usersClient: ClientProxy) {}

  // User Operations
  async createUser(createUserDto: CreateUserDto) {
    return firstValueFrom(
      this.usersClient.send('USER_CREATE', createUserDto)
    );
  }

  async getUserMeta(email: string) {
    return firstValueFrom(
      this.usersClient.send('USER_GET_META', email)
    );
  }

  // Order Operations
  async getAllOrdersMeta(email: string) {
    return firstValueFrom(
      this.usersClient.send('USER_GET_ALL_ORDERS_META', email)
    );
  }

  async getOrder(email: string, orderId: string) {
    return firstValueFrom(
      this.usersClient.send('USER_GET_ORDER', { email, id: orderId })
    );
  }

  // Address Operations
  async addressUpdate(email: string, action: string, address?: AddressDTO) {
    return firstValueFrom(
      this.usersClient.send('USER_ADDRESS_UPDATE', { email, action, address })
    );
  }

  // Review Operations
  async reviewCreate(email: string, review: CreateReviewDTO) {
    return firstValueFrom(
      this.usersClient.send('USER_REVIEW_CREATE', { email, review })
    );
  }

  async reviewUpdate(email: string, reviewId: string, review: UpdateReviewDTO) {
    return firstValueFrom(
      this.usersClient.send('USER_REVIEW_UPDATE', { email, reviewId, review })
    );
  }

  async reviewDelete(email: string, reviewId: string) {
    return firstValueFrom(
      this.usersClient.send('USER_REVIEW_DELETE', { email, reviewId })
    );
  }

  // Shopping List Operations
  async getALLShoppingLists(email: string) {
    return firstValueFrom(
      this.usersClient.send('USER_GET_ALL_SHOPPING_LISTS', email)
    );
  }

  async getShoppingList(email: string, listId: string) {
    return firstValueFrom(
      this.usersClient.send('USER_GET_SHOPPING_LIST', { email, id: listId })
    );
  }

  async shoppingListCreate(email: string, name: string, description?: string) {
    return firstValueFrom(
      this.usersClient.send('USER_SHOPPING_LIST_CREATE', { email, name, description })
    );
  }

  async shoppingListRemove(email: string, listId: string) {
    return firstValueFrom(
      this.usersClient.send('USER_SHOPPING_LIST_REMOVE', { email, id: listId })
    );
  }

  async shoppingListAddItem(email: string, listId: string, productId: string) {
    return firstValueFrom(
      this.usersClient.send('USER_SHOPPING_LIST_ADD_ITEM', { 
        email, 
        listId, 
        product: productId 
      })
    );
  }
  async shoppingListDeleteItem(email: string, listId: string, productId: string) {
    return firstValueFrom(
      this.usersClient.send('USER_SHOPPING_LIST_DELETE_ITEM', { 
        email, 
        listId, 
        product: productId 
      })
    );
  }

  // Cart Operations
  async getCart(email: string) {
    return firstValueFrom(
      this.usersClient.send('USER_GET_CART', email)
    );
  }

  async clearCart(email: string) {
    return firstValueFrom(
      this.usersClient.send('USER_CLEAR_CART', email)
    );
  }

  async cartUpdate(email: string, productId: string, action: string, quantity?: number) {
    return firstValueFrom(
      this.usersClient.send('USER_CART_UPDATE', { 
        email, 
        productId, 
        action, 
        quantity 
      })
    );
  }
}