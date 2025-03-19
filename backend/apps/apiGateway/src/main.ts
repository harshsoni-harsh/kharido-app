import { NestFactory } from '@nestjs/core';
import { apiGatewayModule } from './apiGateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(apiGatewayModule);
  const port = process.env.API_GATEWAY_PORT || 3000;

  await app.listen(port, () => {
    Logger.log(`Gateway API is running on port ${port}`);
  });

}
bootstrap();
