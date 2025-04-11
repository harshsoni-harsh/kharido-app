import { Controller, Get, Query, Req, Res, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../JwtAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async googleLogin(@Res() res: Response) {
    const { url } = await this.authService.googleLogin();
    return res.redirect(url);
  }

  @Get('google/callback')
  async googleAuthRedirect(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.authService.googleAuthRedirect(code);
    const frontendDomain = new URL(
      process.env.FRONTEND_URI ?? 'http://localhost:3000',
    ).hostname;

    // Store JWT access token
    res.cookie('jwt', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: frontendDomain,
    });

    // Store JWT refresh token
    res.cookie('refresh', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: frontendDomain,
    });

    // Store Google access token
    res.cookie('google_access_token', tokens.googleAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: frontendDomain,
    });

    res.redirect(process.env.FRONTEND_URI ?? 'http://localhost:3000');
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const googleAccessToken = req.cookies['google_access_token'];
    await this.authService.logout(googleAccessToken);

    const frontendDomain = new URL(
      process.env.FRONTEND_URI ?? 'http://localhost:3000',
    ).hostname;

    // Clear all cookies
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: frontendDomain,
    });
    res.clearCookie('refresh', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: frontendDomain,
    });
    res.clearCookie('google_access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: frontendDomain,
    });

    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URI ?? 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Redirect to Google's sign-out URL, then back to login page
    res.redirect(
      'https://accounts.google.com/Logout?continue=' +
        encodeURIComponent(process.env.FRONTEND_URI  ?? 'http://localhost:3000/'),
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}
