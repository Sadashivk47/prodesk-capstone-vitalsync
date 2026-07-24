import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import dotenv from "dotenv";

import { initializeDatabase } from "./config/data-source.js";
import { AppModule } from "./nest/app.module.js";

dotenv.config();

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
      console.warn(`[CORS] Blocked origin: ${incomingOrigin}`);
      callback(new Error(`CORS: origin ${incomingOrigin} is not allowed`));
    },
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(PORT, "0.0.0.0");
  console.log(`✅ VitalSync API Server running on http://0.0.0.0:${PORT}`);
  console.log(`   Allowed origins: ${[...allowedOrigins].join(", ")} + *.vercel.app`);
}

startServer();
