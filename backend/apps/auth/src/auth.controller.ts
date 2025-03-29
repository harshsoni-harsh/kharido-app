import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @MessagePattern('google')
  googleLogin() {
    return { message: 'Redirecting to Google...' };
  }

  @UseGuards(GoogleAuthGuard)
  @MessagePattern('google-auth-callback')
  async googleAuthRedirect(@Payload() user) {
    const { accessToken, refreshToken } =
      await this.authService.generateTokens(user);

    return { accessToken, refreshToken };
  }

  @MessagePattern('logout')
  logout() {
    return { message: 'Logged out' };
  }
}
