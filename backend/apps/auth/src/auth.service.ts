import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.AUTH_REDIRECT_URI,
  );

  constructor(
    private jwtService: JwtService,
    @Inject('USERS_CLIENT') private userClient: ClientProxy,
  ) {}

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

    if (!(data.email && data.name && data.id)) {
      Logger.debug(`${data.email}, ${data.name}, ${data.id}`, 'auth.service');
      throw new InternalServerErrorException('Data undefined');
    }

    const user = await this.findOrCreateUser({
      email: data.email,
      name: data.name || data.email?.split('@')[0],
      googleId: data.id,
    });

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

  private async findOrCreateUser(userData: {
    email: string;
    name: string;
    googleId: string;
  }) {
    const createUserDto = {
      email: userData.email,
      name: userData.name,
      gender: 'unspecified',
    };

    const creationResult = await lastValueFrom(
      this.userClient.send('USER_CREATE', createUserDto).pipe(timeout(5000)),
    );
    if (
      !creationResult ||
      (creationResult.statusCode !== 201 && creationResult.statusCode !== 409)
    ) {
      Logger.log(
        `${creationResult.statusCode} ${JSON.stringify(creationResult?.data)}`,
      );
      throw new Error('Failed to create user');
    }
    return {
      id: userData.googleId,
      email: userData.email,
      name: userData.name,
    };
  }
}
