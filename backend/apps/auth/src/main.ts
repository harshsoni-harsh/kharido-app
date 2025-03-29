import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        port: parseInt(process.env.AUTH_SERVICE_PORT ?? '3004'),
      },
    },
  );
  await app.listen();
  Logger.log(`Auth Microservice is running on port ${process.env.AUTH_SERVICE_PORT ?? '3004'}`)
}
bootstrap();
