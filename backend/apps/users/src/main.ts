import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.USERS_SERVICE_PORT || '3001');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        port: parseInt(process.env.USERS_SERVICE_PORT || '3001'),
      },
    },
  );
  await app.listen();
}
bootstrap();
