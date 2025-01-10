import { Global, Module } from '@nestjs/common';
import { LoggerStorage } from './logger-storage';
import { LoggerInterceptor } from './logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomLogger } from './logger';

@Global()
@Module({
  providers: [
    CustomLogger,
    LoggerStorage,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
  exports: [LoggerStorage, CustomLogger],
})
export class LoggerModule {}
