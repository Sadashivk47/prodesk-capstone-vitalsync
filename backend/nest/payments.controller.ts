import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Inject,
  Headers,
} from "@nestjs/common";
import { PaymentsService } from "../services/PaymentsService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CreateCheckoutSessionDto, ConfirmPaymentDto } from "../dto/create-checkout-session.dto.js";

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
    @Body() dto: CreateCheckoutSessionDto,
    @Headers("origin") originHeader?: string
  ) {
    const userId = Number(req.user.id);
    const userEmail = req.user.email;
    return this.paymentsService.createCheckoutSession(userId, userEmail, dto, originHeader);
  }

  @Post("confirm")
  async confirmPayment(@Req() req: any, @Body() dto: ConfirmPaymentDto) {
    const userId = Number(req.user.id);
    return this.paymentsService.confirmPayment(userId, Number(dto.paymentId), dto.sessionId);
  }
}
