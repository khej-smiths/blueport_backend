import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import {
  UPLOAD_LIMIT_SIZE_OBJ_TOKEN,
  UPLOAD_TYPE_LIST,
  UPLOAD_TYPE_LIST_TOKEN,
  UPLOAD_VALID_FILE_EXTENSION_OBJ_TOKEN,
} from './consts';
import { HttpModule } from '@nestjs/axios';

// 파일을 업로드하는 경우

@Module({
  providers: [
    UploadService,
    {
      // 파일을 업로드하는 경우
      provide: UPLOAD_TYPE_LIST_TOKEN,
      useValue: UPLOAD_TYPE_LIST,
    },
    {
      // 업로드 타입별 용량 제한
      provide: UPLOAD_LIMIT_SIZE_OBJ_TOKEN,
      useValue: {
        'post-image': 8 * 1024 * 1024, // 8MB
        'profile-image': 3 * 1024 * 1024, // 3  MB
      },
    },
    {
      // 허용하는 파일 확장자 제한
      provide: UPLOAD_VALID_FILE_EXTENSION_OBJ_TOKEN,
      useValue: {
        'post-image': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
        'profile-image': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      },
    },
  ],
  controllers: [UploadController],
  imports: [HttpModule],
})
export class UploadModule {}
