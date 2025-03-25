import { NestFactory } from '@nestjs/core';
import { PublicModule } from './public.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   PublicModule,

  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       port: 3001,
  //     },
  //   },
  // );
  // await app.listen();
   const port = parseInt(process.env.PUBLIC_SERVICE_PORT || '3001');
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      PublicModule,
      {
        transport: Transport.TCP,
        options: {
          port: parseInt(process.env.PUBLIC_SERVICE_PORT || '3001'),
        },
      },
    );
    await app.listen();
}
bootstrap();
