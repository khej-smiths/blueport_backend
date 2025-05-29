import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  // TODO 파일 업로드 로직 추가
  async uploadFile(): Promise<string> {
    return 'hi';
  }
}
