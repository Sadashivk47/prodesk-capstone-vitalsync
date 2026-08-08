import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * Global Exception Filter — catches EVERY error thrown anywhere in the app.
 *
 * Why this exists:
 *   Without this, an unexpected crash returns a raw stack trace to the user —
 *   which leaks your file paths, library versions, and DB structure.
 *   This filter intercepts every error and always returns a clean, safe,
 *   consistent JSON shape so the frontend can always trust the response format.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;

    if (exception instanceof HttpException) {
      // Planned error: e.g. NotFoundException, BadRequestException
      // Use the status code and message it already carries.
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as any).message ?? exception.message;
    } else {
      // Unexpected crash — log it server-side but NEVER send raw details to client.
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "An unexpected error occurred. Please try again later.";
      this.logger.error(
        `Unhandled exception on [${request.method}] ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
