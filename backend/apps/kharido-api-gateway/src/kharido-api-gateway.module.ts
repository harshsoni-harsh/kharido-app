import { Module } from '@nestjs/common';
import { KharidoApiGatewayController } from './kharido-api-gateway.controller';
import { KharidoApiGatewayService } from './kharido-api-gateway.service';
import { UsersModule } from './users/users.module';
import { UsersService } from 'apps/kharido-api-gateway/src/users/users.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdminModule } from './admin/admin.module';
import { PublicModule } from './public/public.module';

@Module({
  imports:
    [
    
      ClientsModule.register([
        {
          name: 'USERS_CLIENT',
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 3001, 
          },
        },
      ]),
      UsersModule,
      AdminModule,
      PublicModule
    ],
  controllers: [KharidoApiGatewayController],
  providers: [UsersService]
})
export class KharidoApiGatewayModule { }
