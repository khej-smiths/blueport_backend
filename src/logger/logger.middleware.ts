import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerStorage } from './logger-storage';
import { CustomLogger } from './logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerStorage: LoggerStorage) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.loggerStorage.run({ customLogger: new CustomLogger() }, () => {
      next();
    });
  }
}
