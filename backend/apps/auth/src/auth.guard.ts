import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MicroserviceAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToRpc().getData();

    if (request?.apiSecret !== process.env.API_GATEWAY_SECRET) {
      throw new RpcException(new UnauthorizedException('Unauthorized request'));
    }

    return true;
  }
}
