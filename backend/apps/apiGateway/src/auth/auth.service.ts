import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_CLIENT') private authClient: ClientProxy) {}

  async googleLogin() {
    const response = await firstValueFrom(
      this.authClient.send('google-auth', {}),
    );
    return response;
  }

  async googleAuthRedirect(user) {
    const tokens = await firstValueFrom(
      this.authClient.send('google-auth-callback', user),
    );
    return tokens;
  }

  async logout() {
    await firstValueFrom(this.authClient.send('logout', {}));
  }
}
