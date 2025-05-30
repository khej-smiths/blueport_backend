import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('blog-image')
  @UseInterceptors(
    // API의 request의 body의 form-data에 선언되어야 할 필드명
    FileInterceptor('file'),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<string> {
    return await this.uploadService.uploadFile(file, 'blog-image');
  }
}
