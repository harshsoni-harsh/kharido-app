import { Controller, Get, HttpException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { MESSAGES } from '@nestjs/core/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from 'apps/libs/shared/schemas/user.schema';
import { CreateUserDto } from 'apps/libs/shared/dto/create/createUser.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('create-user') // Listening for 'create-user' pattern
  async createUser(@Payload() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @MessagePattern('user-all-orders')
  async getUserAllOrderMeta(@Payload() email: string) {
    try {
      const res = await this.usersService.getAllOrdersMeta(email);
      return res;
    } catch ({response}) {
      Logger.log(response)
      throw new HttpException(response.message, response.status);
    }
  }
}
