import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Inject,
  Headers,
  ValidationPipe,
} from "@nestjs/common";
import { PaymentsService } from "../services/PaymentsService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CreateCheckoutSessionDto, ConfirmPaymentDto } from "../dto/create-checkout-session.dto.js";

const checkoutValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  expectedType: CreateCheckoutSessionDto,
});

const confirmValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  expectedType: ConfirmPaymentDto,
});

@Controller("api/payments")
@UseGuards(JwtAuthGuard)
export class NestPaymentController {
  constructor(@Inject(PaymentsService) private readonly paymentsService: PaymentsService) {}

  @Get()
  async getMyPayments(@Req() req: any) {
    const userId = Number(req.user.id);
    return this.paymentsService.getUserPayments(userId);
  }

  @Post("create-checkout-session")
  async createCheckoutSession(
    @Req() req: any,
    @Body(checkoutValidationPipe) dto: CreateCheckoutSessionDto,
    @Headers("origin") originHeader?: string
  ) {
    const userId = Number(req.user.id);
    const userEmail = req.user.email;
    return this.paymentsService.createCheckoutSession(userId, userEmail, dto, originHeader);
  }

  @Post("confirm")
  async confirmPayment(@Req() req: any, @Body(confirmValidationPipe) dto: ConfirmPaymentDto) {
    const userId = Number(req.user.id);
    return this.paymentsService.confirmPayment(userId, Number(dto.paymentId), dto.sessionId);
  }
}
