import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private prisma: PrismaService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as {
      message?: string | string[];
      code?: string;
    };
    if (
      exceptionResponse?.message?.includes(
        'Authentication failed against database server',
      )
    ) {
      this.prisma.connectToDB();
    }

    const errorObject = {
      statusCode: status,
      message: exceptionResponse.message,
      path: request.url,
      code: exceptionResponse.code,
    };

    response.status(status).json({
      error: errorObject,
    });
  }
}
