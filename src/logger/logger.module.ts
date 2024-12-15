import { Module } from '@nestjs/common';
import { LoggerStorage } from './logger-storage';
import { LoggerInterceptor } from './logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    LoggerStorage,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
  exports: [LoggerStorage],
})
export class LoggerModule {}
