import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  password?: string;

  @IsString()
  name!: string;

  @IsIn(["doctor", "patient"])
  role!: "doctor" | "patient";

  @IsOptional()
  @IsString()
  specialty?: string;
}
