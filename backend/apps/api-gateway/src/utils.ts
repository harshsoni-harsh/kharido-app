import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { RPCResponseObject } from '@shared/types';

export const handleResponse = (res: RPCResponseObject) => {
  if (res.success) return res.data;
  else {
    switch (res.statusCode) {
      case 400:
        throw new BadRequestException(res.message);
      case 404:
        throw new NotFoundException(res.message);
      default:
        throw new HttpException(res.message, res.statusCode);
    }
  }
};
