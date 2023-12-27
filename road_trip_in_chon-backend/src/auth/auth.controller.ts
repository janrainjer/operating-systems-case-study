import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthGoogleLogin, AuthEmail, RegistEmail } from "./dto/auth-login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login-google")
  async authenicateWithGoogleOAuth(@Body() authLogin: AuthGoogleLogin) {
    return await this.authService.authenticateWithGoogleOAuth(authLogin);
  }

  @Post("regist-email")
  async registWithEmailPassword(@Body() authEmail: RegistEmail) {
    return await this.authService.registWithEmailPassword(authEmail);
  }
  @Post("login-email")
  async loginWithEmailPassword(@Body() authEmail: AuthEmail) {
    return await this.authService.loginWithEmailPassword(authEmail);
  }
}
