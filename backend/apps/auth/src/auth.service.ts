import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.AUTH_REDIRECT_URI,
  );

  constructor(private jwtService: JwtService) {}

  googleAuthUrl() {
    return this.client.generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
    });
  }

  async handleGoogleCallback(code: string) {
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: this.client });
    const { data } = await oauth2.userinfo.get();

    const user = {
      id: data.id,
      email: data.email,
      name: data.name
    };

    return this.generateTokens(user);
  }

  async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_PRIVATE_KEY,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_PRIVATE_KEY,
    });

    return { accessToken, refreshToken };
  }
}
