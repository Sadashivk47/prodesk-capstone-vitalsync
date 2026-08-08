import { Controller, Post, Get, Body, UseGuards, Req, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Throttle, SkipThrottle } from "@nestjs/throttler";
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
  // Phase 3 — Strict rate limit: only 5 login attempts per 60 seconds per IP.
  // This prevents brute-force password attacks.
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: { user: unknown }) {
    return { user: req.user };
  }
}
