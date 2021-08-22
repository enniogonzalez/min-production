import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionSended = exception.getResponse();

    delete exceptionSended['error'];
    delete exceptionSended['statusCode'];

    if (exceptionSended['message'] instanceof Array) {
      if (exceptionSended['message'].length === 0) {
        exceptionSended['message'] = '';
      } else {
        exceptionSended['message'] = exceptionSended['message'][0];
      }
    }

    if (typeof exceptionSended === 'object') {
      response.status(status).json({
        success: false,
        ...exceptionSended,
      });
    }
  }
}
