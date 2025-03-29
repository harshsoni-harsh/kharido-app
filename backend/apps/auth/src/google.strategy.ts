import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oidc/lib';

@Injectable()
export class GoogleOidcStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.AUTH_CALLBACK_URL,
      scope: ['openid', 'email', 'profile'],
    });
  }

  async validate(issuer: string, profile: any, done: VerifyCallback) {
    const user = {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value,
    };
    done(null, user);
  }
}
