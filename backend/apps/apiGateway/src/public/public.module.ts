import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PublicController } from './public.controller';



@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PUBLIC_CLIENT',
        transport: Transport.TCP,
        options: {
          port: parseInt(process.env.PUBLIC_SERVICE_PORT ?? '3003'),
        },
      },
    ]),
  ],
  providers: [PublicService],
  controllers: [PublicController],
})
export class PublicModule {}

