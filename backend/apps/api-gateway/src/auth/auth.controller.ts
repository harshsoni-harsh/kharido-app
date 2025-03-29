import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../JwtAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async googleLogin(@Res() res) {
    const { url } = await this.authService.googleLogin();
    return res.redirect(url);
  }

  @Get('google/callback')
  async googleAuthRedirect(@Query('code') code: string, @Res() res) {
    const tokens = await this.authService.googleAuthRedirect(code);

    res.cookie('jwt', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('refresh', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.redirect('http://localhost:3000/dashboard');
  }

  @Get('logout')
  async logout(@Res() res) {
    await this.authService.logout();
    res.clearCookie('jwt');
    res.clearCookie('refresh');
    res.json({ message: 'Logged out' });
  }

  @Get('hello')
  @UseGuards(JwtAuthGuard)
  async sayHello(@Req() req: Request) {
    return "hello"
  }
}
