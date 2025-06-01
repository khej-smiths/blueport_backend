import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoggerStorage } from 'src/logger/logger-storage';
import {
  UPLOAD_LIMIT_SIZE_OBJ_TOKEN,
  UPLOAD_TYPE,
  UPLOAD_TYPE_LIST,
  UPLOAD_TYPE_LIST_TOKEN,
} from './consts';
@Injectable()
export class UploadService {
  constructor(
    private readonly als: LoggerStorage,
    @Inject(UPLOAD_TYPE_LIST_TOKEN)
    private readonly UPLOAD_TYPE_LIST: Array<UPLOAD_TYPE>,
    @Inject(UPLOAD_LIMIT_SIZE_OBJ_TOKEN)
    private readonly UPLOAD_LIMIT_SIZE_OBJ: Record<UPLOAD_TYPE, number>,
  ) {}

  // TODO 파일 업로드 로직 추가
  async uploadFile(
    file: Express.Multer.File,
    type: UPLOAD_TYPE,
  ): Promise<string> {
    // 에러 케이스
    const ERR_OVER_FILE_SIZE = 'ERR_OVER_FILE_SIZE'; // 허용 가능한 파일 사이즈를 오버한 경우
    const ERR_NOT_VALID_TYPE = 'ERR_NOT_VALID_TYPE'; // 업로드 할 수 있는 타입이 아닌 경우

    // 로거가져오기
    const logger = this.als.getStore()?.customLogger!;

    // file에서 buffer만 뺀 rest 객체 만들기(로그에서 buffer 제외시키기 위해)
    const { buffer, ...rest } = file;

    // 파일 로거 찍기(로그가 제대로 찍히지 않더라도)
    logger.customLog({
      input: {
        file: {
          ...rest,
        },
        type,
      },
    });

    const requestId = this.als.getStore()!.customLogger.getRequestId();

    if (!UPLOAD_TYPE_LIST.includes(type)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: '잘못된 파일 타입입니다.',
          error: `Bad Request - ${ERR_NOT_VALID_TYPE} - [${requestId}]`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (file.size > this.UPLOAD_LIMIT_SIZE_OBJ[type]) {
      // 예외처리 1. 파일 사이즈가 8MB가 넘어가는 경우
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: '파일 사이즈를 확인해주세요.',
          error: `Bad Request - ${ERR_OVER_FILE_SIZE} - [${requestId}]`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // TODO 파일 업로드 후 url 리턴

    return 'url';
  }
}
