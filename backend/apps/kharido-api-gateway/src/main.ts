import { NestFactory } from '@nestjs/core';
import { KharidoApiGatewayModule } from './kharido-api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     KharidoApiGatewayModule,
//     {
//       transport: Transport.TCP,
//       options:{
//         port:3000
//       }
//     }
//   );
//   await app.listen();
// }
// bootstrap();

async function bootstrap() {
  // Create a hybrid application
  const app = await NestFactory.create(KharidoApiGatewayModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost', 
      port: 3002,        
    },
  });

  // Start both the HTTP server and the microservice client
  await app.startAllMicroservices(); // Starts the TCP client
  await app.listen(3000);            // Starts the HTTP server on port 3000

  console.log('Gateway API is running on http://localhost:3000');
}
bootstrap();
