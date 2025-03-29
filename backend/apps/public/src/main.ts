import { NestFactory } from '@nestjs/core';
import { PublicModule } from './public.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      PublicModule,
      {
        transport: Transport.TCP,
        options: {
          host: process.env.PUBLIC_HOST ?? 'localhost',
          port: parseInt(process.env.PUBLIC_SERVICE_PORT || '3001'),
        },
      },
    );
    await app.listen();
}
bootstrap();
