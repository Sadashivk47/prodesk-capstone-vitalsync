import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import express from "express";
import path from "path";
import dotenv from "dotenv";

import { initializeDatabase } from "./config/data-source.js";
import { AppModule } from "./nest/app.module.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
  // Initialize TypeORM Database Connection & Seeding
  await initializeDatabase();

  const frontendUrl = process.env.FRONTEND_URL;
  // In dev, Vite runs on :5173 — allow that origin too
  const corsOrigins = frontendUrl
    ? [frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];

  // Bootstrap NestJS Application — API only
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Production: serve the built frontend from dist/
  if (process.env.NODE_ENV === "production") {
    const expressInstance = app.getHttpAdapter().getInstance() as express.Application;
    const distPath = path.join(process.cwd(), "dist");
    expressInstance.use(express.static(distPath));
    expressInstance.get("*path", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  await app.listen(PORT, "0.0.0.0");
  console.log(`✅ VitalSync API Server running on http://0.0.0.0:${PORT}`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`   Frontend dev server: http://localhost:5173`);
  }
}

startServer();

