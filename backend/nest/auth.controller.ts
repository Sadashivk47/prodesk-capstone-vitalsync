import { Controller, Post, Get, Body, UseGuards, Req, HttpException, HttpStatus, Inject, ValidationPipe } from "@nestjs/common";
import { Throttle, SkipThrottle } from "@nestjs/throttler";
import { AuthService } from "../services/AuthService.js";
import { RegisterDto } from "../dto/register.dto.js";
import { LoginDto } from "../dto/login.dto.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

const registerValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  expectedType: RegisterDto,
});

const loginValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  expectedType: LoginDto,
});

@Controller("api/auth")
export class NestAuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body(registerValidationPipe) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body(loginValidationPipe) dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: { user: unknown }) {
    return { user: req.user };
  }
}
