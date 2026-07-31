import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import Stripe from "stripe";
import { getSafeRepository } from "../config/data-source.js";
import { Payment } from "../entities/Payment.js";
import { User } from "../entities/User.js";
import { CreateCheckoutSessionDto } from "../dto/create-checkout-session.dto.js";

@Injectable()
export class PaymentsService {
  private paymentRepo = getSafeRepository(Payment);
  private userRepo = getSafeRepository(User);

  private getStripeClient(): Stripe | null {
    let key = process.env.STRIPE_SECRET_KEY || process.env.stripe_secret_key;
    if (!key) return null;

    key = key.trim().replace(/^["']|["']$/g, "").trim();
    if (!key || key.startsWith("mk_") || key.includes("mock_key")) {
      return null;
    }
    return new Stripe(key, { apiVersion: "2025-02-24.acacia" as any });
  }

  async getUserPayments(userId: number) {
    const list = await this.paymentRepo.find({ where: { userId } });
    // Sort descending by id or createdAt
    return list.sort((a: any, b: any) => Number(b.id) - Number(a.id));
  }

  async createCheckoutSession(
    userId: number,
    userEmail: string,
    dto: CreateCheckoutSessionDto,
    originUrl?: string
  ) {
    let payment: any = null;

    // If referenceId is provided (e.g. for existing due), check if pending payment exists
    if (dto.referenceId && dto.type === "due") {
      const existing = await this.paymentRepo.findOne({
        where: { id: dto.referenceId, userId },
      });
      if (existing) {
        payment = existing;
      }
    }

    if (!payment) {
      payment = this.paymentRepo.create({
        userId,
        type: dto.type,
        amount: Number(dto.amount),
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        status: "pending",
        referenceId: dto.referenceId,
      });
      payment = await this.paymentRepo.save(payment);
    }

    const baseUrl = (originUrl || process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
    const successUrl = `${baseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}&payment_id=${payment.id}`;
    const cancelUrl = `${baseUrl}/?payment=cancelled&payment_id=${payment.id}`;

    const stripe = this.getStripeClient();
    let checkoutUrl = "";
    let sessionId = "";

    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          customer_email: userEmail,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: dto.description,
                  description: `VitalSync Healthcare — ${dto.type.toUpperCase()}`,
                },
                unit_amount: Math.round(Number(dto.amount) * 100),
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            paymentId: String(payment.id),
            userId: String(userId),
            type: dto.type,
          },
        });

        checkoutUrl = session.url || "";
        sessionId = session.id;
      } catch (err: any) {
        console.error("[PaymentsService] Stripe API Error creating checkout session:", err.message);
        throw new BadRequestException(
          `Stripe API Error: ${err.message}. Please check that your STRIPE_SECRET_KEY in .env starts with 'sk_test_'.`
        );
      }
    } else {
      throw new BadRequestException(
        "Stripe is not configured with a valid test secret key. Please set STRIPE_SECRET_KEY=sk_test_... in your .env file to enable real Stripe Checkout UI."
      );
    }

    payment.stripeSessionId = sessionId;
    await this.paymentRepo.save(payment);

    return {
      checkoutUrl,
      sessionId,
      paymentId: payment.id,
      amount: payment.amount,
      currency: "usd",
      status: payment.status,
    };
  }

  async confirmPayment(userId: number, paymentId: number, sessionId: string) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`Payment #${paymentId} not found`);
    }

    if (payment.userId !== userId) {
      throw new ForbiddenException("You can only confirm payments belonging to your account.");
    }

    // Verify session status with Stripe if active
    const stripe = this.getStripeClient();
    if (stripe && sessionId && !sessionId.startsWith("cs_test_simulated")) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
          throw new BadRequestException("Stripe Checkout Session is not paid yet.");
        }
      } catch (err: any) {
        console.warn("[PaymentsService] Could not verify Stripe session status:", err.message);
      }
    }

    payment.status = "paid";
    await this.paymentRepo.save(payment);

    return {
      success: true,
      message: "Payment successfully recorded as paid.",
      payment,
    };
  }
}
