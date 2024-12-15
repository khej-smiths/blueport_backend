import { Module } from '@nestjs/common';
import { LoggerStorage } from './logger-storage';

@Module({
  providers: [LoggerStorage],
  exports: [LoggerStorage],
})
export class LoggerModule {}
