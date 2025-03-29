import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('google-auth')
  googleLogin() {
    return { url: this.authService.googleAuthUrl() };
  }

  @MessagePattern('google-auth-callback')
  async googleAuthRedirect(@Payload() data: { code: string }) {
    try {
      return await this.authService.handleGoogleCallback(data.code);
    } catch (err) {
      Logger.error(err.response.text)
      throw new RpcException("Bad Request")
    }
  }

  @MessagePattern('logout')
  logout() {
    return { message: 'Logged out' };
  }
}
