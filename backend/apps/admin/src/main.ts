import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AdminModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.ADMIN_HOST ?? 'localhost',
        port: parseInt(process.env.ADMIN_SERVICE_PORT || '3001'),
      },
    },
  );
  await app.listen();
}
bootstrap();
