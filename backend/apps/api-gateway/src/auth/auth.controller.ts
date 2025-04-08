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
    const frontendDomain = new URL(
      process.env.FRONTEND_URI ?? 'http://localhost:3000',
    ).hostname;

    res.cookie('jwt', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: frontendDomain,
    });
    res.cookie('refresh', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      domain: frontendDomain,
    });

    res.redirect(process.env.FRONTEND_URI ?? 'http://localhost:3000');
  }

  @Get('logout')
  async logout(@Res() res) {
    await this.authService.logout();
    res.clearCookie('jwt');
    res.clearCookie('refresh');
    res.json({ message: 'Logged out' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}
