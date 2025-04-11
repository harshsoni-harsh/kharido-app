import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const port = process.env.API_GATEWAY_PORT || 3000;

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URI ?? 'http://localhost:3000',
    credentials: true,
  });
  
  
  await app.listen(port, () => {
    Logger.log(`Gateway API is running on port ${port}`);
  });

}
bootstrap();
