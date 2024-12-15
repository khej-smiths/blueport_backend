import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { CustomLogger } from './logger';

export type AlsType = {
  customLogger: CustomLogger;
};

@Injectable()
export class LoggerStorage extends AsyncLocalStorage<AlsType> {
  constructor() {
    super();
  }
}
