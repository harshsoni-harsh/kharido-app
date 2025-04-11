import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_CLIENT') private authClient: ClientProxy) {}

  async googleLogin() {
    const response = await firstValueFrom(
      this.authClient.send('google-auth', {
        apiSecret: process.env.API_GATEWAY_SECRET,
      }),
    );
    return response;
  }

  async googleAuthRedirect(code: string) {
    const tokens = await firstValueFrom(
      this.authClient.send('google-auth-callback', {
        code,
        apiSecret: process.env.API_GATEWAY_SECRET,
      }),
    );
    return tokens;
  }

  async logout(googleAccessToken:string) {
    await firstValueFrom(
      this.authClient.send('logout', {
        apiSecret: process.env.API_GATEWAY_SECRET,
        googleAccessToken:googleAccessToken
      }),
    );
  }
}
