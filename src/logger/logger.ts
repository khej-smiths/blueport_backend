import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  private readonly requestId: string;

  constructor() {
    this.requestId = new Date().toISOString();
    this.log('requestId');
  }

  log(message: string) {
    console.log(this.requestId, message);
  }

  error(message: string) {
    console.error(this.requestId, message);
  }

  warn(message: string) {
    console.warn(this.requestId, message);
  }
}
