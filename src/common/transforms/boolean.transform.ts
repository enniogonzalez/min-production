import { BadRequestException } from '@nestjs/common';

export function BooleanTransform<T = any>(value: T): boolean {
  if (typeof value['value'] === 'string') {
    switch (value['value'].toLowerCase()) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        throw new BadRequestException({
          statusCode: 400,
          message: [`${value['key']} must be a boolean value`],
          error: 'Bad Request',
        });
    }
  }

  return value['value'];
}
