import { Controller, Post } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('file')
  async uploadFile(): Promise<string> {
    return await this.uploadService.uploadFile();
  }
}
