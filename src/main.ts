import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  // TODO orm 바꾸기
  // TODO 도커, 환경변수 파일들 셋팅 다시하기(gitignore, 파일명 등등)
  // TODO mysql 볼륨은 외부에 미리 셋팅하기
  // TODO 나중에 비번 재설정 로직 필요함
  // TODO 회원탈퇴
  // TODO input class-validator 적용
  // TODO input 이미지 저장 API(8MB)
  // TODO 이미지 업로드는 백이 프록시 역할 예정. 단, 사용하지 않은 이미지를 어떻게 처리할지는 추가 확인 필요

  // TODO 유저 조회, 변경 추가 필요

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT')!;

  await app.listen(port);
}
bootstrap();
