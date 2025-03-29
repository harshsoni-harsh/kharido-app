import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("google")
  async googleLogin(@Req() req, @Res() res) {
    const response = await this.authService.googleLogin();
    return res.json(response);
  }

  @Get("google/callback")
  async googleAuthRedirect(@Req() req, @Res() res) {
    const tokens = await this.authService.googleAuthRedirect(req.user);

    res.cookie("jwt", tokens.accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
    res.cookie("refresh", tokens.refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

    res.redirect("http://localhost:3000/dashboard");
  }

  @Get("logout")
  async logout(@Res() res) {
    await this.authService.logout();
    res.clearCookie("jwt");
    res.clearCookie("refresh");
    res.json({ message: "Logged out" });
  }
}