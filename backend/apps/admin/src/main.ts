import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AdminModule,

  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       port: 3003,
  //     },
  //   },
  // );
  // await app.listen();
   const port = parseInt(process.env.ADMIN_SERVICE_PORT || '3001');
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AdminModule,
        {
          transport: Transport.TCP,
          options: {
            port: parseInt(process.env.ADMIN_SERVICE_PORT || '3001'),
          },
        },
      );
      await app.listen();
}
bootstrap();
