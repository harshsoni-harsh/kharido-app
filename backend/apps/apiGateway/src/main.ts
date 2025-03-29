import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './apiGateway.module';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const port = process.env.API_GATEWAY_PORT || 3000;

  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  app.use(cookieParser());

  await app.listen(port, () => {
    Logger.log(`Gateway API is running on port ${port}`);
  });

}
bootstrap();
