import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UPLOAD_TYPE } from './consts';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * @description 파일 업로드. form-data의 key를 'file'로 설정해야한다.
   */
  @Post(':type')
  @UseInterceptors(
    // API의 request의 body의 form-data에 선언되어야 할 필드명
    FileInterceptor('file'),
  )
  async uploadFile(
    @Param('type') type: UPLOAD_TYPE,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<string> {
    return await this.uploadService.uploadFile(file, type);
  }
}
