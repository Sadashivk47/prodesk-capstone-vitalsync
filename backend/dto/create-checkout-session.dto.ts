import { IsString, IsNumber, IsOptional, IsPositive, IsIn } from "class-validator";

export class CreateCheckoutSessionDto {
  @IsString()
  @IsIn(["due", "consultation", "prescription", "general"])
  type!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  description!: string;

  @IsOptional()
  @IsNumber()
  referenceId?: number;

  @IsOptional()
  @IsString()
  dueDate?: string;
}

export class ConfirmPaymentDto {
  @IsNumber()
  paymentId!: number;

  @IsString()
  sessionId!: string;
}
