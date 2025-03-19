import { Body, Controller, Get, Post } from '@nestjs/common';
import { KharidoApiGatewayService } from './kharido-api-gateway.service';
import { Client, ClientTCP, Transport } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/libs/shared/dto/create/createUser.dto';
import { UsersService } from 'apps/kharido-api-gateway/src/users/users.service';

@Controller('users')
export class KharidoApiGatewayController {
  // constructor(private readonly kharidoApiGatewayService: KharidoApiGatewayService) {}
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    // Send message to User Microservice with 'create_user' pattern
    return this.usersService.createUser( createUserDto);
  }
  @Post('all-orders')
  async getUserAllOrders(@Body() body: { email: string }) {
    // Extract email from the request body
    const { email } = body;
    console.log(email);
    return await this.usersService.getUserAllOrders(email);
  }
  @Get()
  getHello(): string {
    return 'hi';
  }
}
