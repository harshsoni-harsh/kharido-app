import { Injectable } from '@nestjs/common';

@Injectable()
export class KharidoApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
