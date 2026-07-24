import { Controller, Post, Get, Body, UseGuards, Req, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { AuthService } from "../services/AuthService.js";
import { RegisterDto } from "../dto/register.dto.js";
import { LoginDto } from "../dto/login.dto.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

@Controller("api/auth")
export class NestAuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: { user: unknown }) {
    return { user: req.user };
  }
}
