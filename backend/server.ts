import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";

import { initializeDatabase } from "./config/data-source.js";
import { AppModule } from "./nest/app.module.js";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter.js";

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
  // Initialize TypeORM Database Connection & Seeding
  await initializeDatabase();

  const frontendUrl = process.env.FRONTEND_URL?.trim().replace(/\/$/, "");

  // Explicit allowlist — dev origins + production Vercel URL
  const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    ...(frontendUrl ? [frontendUrl] : []),
  ]);

  // Bootstrap NestJS without inline cors — we call enableCors() below
  // so it is registered as the very first Express middleware.
  const app = await NestFactory.create(AppModule, { logger: ["log", "warn", "error"] });

  // Full CORS config — must be called before useGlobalPipes and listen()
  app.enableCors({
    origin: (incomingOrigin, callback) => {
      // Allow server-to-server requests (no Origin header) and health checks
      if (!incomingOrigin) return callback(null, true);
      // Exact allowlist match
      if (allowedOrigins.has(incomingOrigin)) return callback(null, true);
      // Safety net: allow any *.vercel.app subdomain (preview deployments)
      if (incomingOrigin.endsWith(".vercel.app")) return callback(null, true);
      // Reject everything else
      new Logger("CORS").warn(`Blocked origin: ${incomingOrigin}`);
      callback(new Error(`CORS: origin ${incomingOrigin} is not allowed`));
    },
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Phase 1 — Global Exception Filter
  // Catches EVERY error and returns a clean, consistent JSON response.
  // Prevents raw stack traces from leaking to clients.
  app.useGlobalFilters(new AllExceptionsFilter());

  // Phase 1 — Global Validation Pipe
  // whitelist: strips any extra fields not in the DTO
  // forbidNonWhitelisted: rejects the request if unknown fields are present
  // transform: converts raw JSON to the typed DTO class
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const serverLogger = new Logger("Bootstrap");
  await app.listen(PORT, "0.0.0.0");
  serverLogger.log(`✅ VitalSync API Server running on http://0.0.0.0:${PORT}`);
  serverLogger.log(`   Allowed origins: ${[...allowedOrigins].join(", ")} + *.vercel.app`);
}

startServer();
