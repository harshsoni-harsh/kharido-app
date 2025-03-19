import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'apps/libs/shared/dto/create/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('all-orders')
  async getUserAllOrders(@Body() body: { email: string }) {
    const { email } = body;
    return await this.usersService.getUserAllOrders(email);
  }
}
