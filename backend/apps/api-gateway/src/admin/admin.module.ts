import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ADMIN_CLIENT',
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_HOST ?? 'localhost',
          port: parseInt(process.env.ADMIN_SERVICE_PORT ?? '3003'),
        },
      },
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_HOST ?? 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT ?? '3004'),
        },
      },
    ]),
 
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
