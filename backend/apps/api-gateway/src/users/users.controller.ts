import { Controller, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddressDTO } from '@libs/shared/dto/common/address.dto';
import { CreateReviewDTO } from '@libs/shared/dto/create/createReview.dto';
import { CreateUserDto } from '@libs/shared/dto/create/createUser.dto';
import { UpdateReviewDTO } from '@libs/shared/dto/update/updateReview.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // User Endpoints
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('get-meta')
  getUserMeta(@Body() body: { email: string }) {
    return this.usersService.getUserMeta(body.email);
  }

  // Order Endpoints
  @Post('get-all-orders')
  getAllOrders(@Body() body: { email: string }) {
    return this.usersService.getAllOrdersMeta(body.email);
  }

  @Post('get-order')
  getOrder(@Body() body: { email: string; orderId: string }) {
    return this.usersService.getOrder(body.email, body.orderId);
  }

  // Address Endpoints
  @Post('update-address')
  updateAddress(
    @Body() body: { email: string; action: string; address?: AddressDTO },
  ) {
    return this.usersService.addressUpdate(
      body.email,
      body.action,
      body.address,
    );
  }

  // Review Endpoints
  @Post('create-review')
  createReview(@Body() body: { email: string; review: CreateReviewDTO }) {
    return this.usersService.reviewCreate(body.email, body.review);
  }

  @Post('update-review')
  updateReview(
    @Body() body: { email: string; reviewId: string; review: UpdateReviewDTO },
  ) {
    return this.usersService.reviewUpdate(
      body.email,
      body.reviewId,
      body.review,
    );
  }

  @Post('delete-review')
  deleteReview(@Body() body: { email: string; reviewId: string }) {
    return this.usersService.reviewDelete(body.email, body.reviewId);
  }

  // Shopping List Endpoints
  @Post('get-all-shopping-lists')
  getAllShoppingLists(@Body() body: { email: string }) {
    return this.usersService.getALLShoppingLists(body.email);
  }

  @Post('get-shopping-list')
  getShoppingList(@Body() body: { email: string; listId: string }) {
    return this.usersService.getShoppingList(body.email, body.listId);
  }

  @Post('create-shopping-list')
  createShoppingList(
    @Body() body: { email: string; name: string; description?: string },
  ) {
    return this.usersService.shoppingListCreate(
      body.email,
      body.name,
      body.description,
    );
  }

  @Post('remove-shopping-list')
  removeShoppingList(@Body() body: { email: string; listId: string }) {
    return this.usersService.shoppingListRemove(body.email, body.listId);
  }
  @Post('add-item-shopping-list')
  shoppingListAddItem(
    @Body() body: { email: string; listId: string; product: string },
  ) {
    return this.usersService.shoppingListAddItem(
      body.email,
      body.listId,
      body.product,
    );
  }
  @Post('delete-item-shopping-list')
  shoppingListDeleteItem(
    @Body() body: { email: string; listId: string; product: string },
  ) {
    return this.usersService.shoppingListDeleteItem(
      body.email,
      body.listId,
      body.product,
    );
  }

  // Cart Endpoints
  @Post('get-cart')
  getCart(@Body() body: { email: string }) {
    return this.usersService.getCart(body.email);
  }

  @Post('clear-cart')
  clearCart(@Body() body: { email: string }) {
    return this.usersService.clearCart(body.email);
  }

  @Post('update-cart')
  updateCart(
    @Body()
    body: {
      email: string;
      productId: string;
      action: string;
      quantity?: number;
    },
  ) {
    return this.usersService.cartUpdate(
      body.email,
      body.productId,
      body.action,
      body.quantity,
    );
  }
}
