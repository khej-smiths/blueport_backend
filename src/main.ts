import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // transform: 네트워크를 통해 넘어오는 페이로드를 지정한 dto 타입에 맞게 객체를 변환
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // TODO aws lightsail로 웹 서버 및 DB 셋팅

  await app.listen(7777);
}
bootstrap();
