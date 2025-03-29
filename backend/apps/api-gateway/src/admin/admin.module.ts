import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
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
})
export class AdminModule {}
