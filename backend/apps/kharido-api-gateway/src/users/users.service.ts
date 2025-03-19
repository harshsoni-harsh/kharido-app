import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/libs/shared/dto/create/createUser.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_CLIENT') private usersClient: ClientProxy) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.usersClient.send('create-user', createUserDto); // Convert Observable to Promise
  }

  async getUserAllOrders(email: string) {
    return this.usersClient.send('user-all-orders', email); // Convert Observable to Promise
  }
  getHello() {
    return 'Hello gateway from users module';
  }
}
