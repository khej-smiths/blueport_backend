import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      // 프론트 서버의 오리진
      origin: ['http://localhost:3000'],
      // 쿠키, 인증헤더 등을 사용할 수 있게 할 것인지
      credentials: true,
    },
  });

  // transform: 네트워크를 통해 넘어오는 페이로드를 지정한 dto 타입에 맞게 객체를 변환
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // TODO https 로 접근되도록 수정하기
  // TODO orm 바꾸기
  // TODO 도커, 환경변수 파일들 셋팅 다시하기(gitignore, 파일명 등등)

  // TODO mysql 볼륨은 외부에 미리 셋팅하기

  await app.listen(7777);
}
bootstrap();
