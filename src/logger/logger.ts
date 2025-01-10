import { ConsoleLogger, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly requestId: string;
  private email: string;
  private logList: Array<string> = [];

  constructor() {
    super();
    this.requestId = uuidv4();
    this.customLog('start', {
      className: this.constructor.name,
      methodName: 'constructor',
    });
  }

  setEmail(email: string) {
    this.email = email;
    this.customLog('set email', {
      className: this.constructor.name,
      methodName: this.setEmail.name,
    });
  }

  customLog(
    message: any,
    option?: { className?: string; methodName?: string },
  ) {
    const prefix = this.getPrefix(option);
    const processedMessage = this.processMessage(message);
    this.logList.push(`${prefix} ${processedMessage}`);
    this.log(processedMessage, prefix);
  }

  // TODO Error, Warn 추가
  // customError(
  //   message: string,
  //   option?: { className?: string; functionName: string },
  // ) {
  //   const prefix = this.getPrefix(option);
  //   console.error(prefix, message);
  // }

  // customWarn(
  //   message: string,
  //   option?: { className?: string; functionName: string },
  // ) {
  //   const prefix = this.getPrefix(option);
  //   console.warn(prefix, message);
  // }

  async destroy() {
    this.customLog(this.logList, {
      className: this.constructor.name,
      methodName: this.destroy.name,
    });
    this.logList = [];
  }

  /**
   * 로그를 구분할 수 있는 prefix를 생성 후 반환하는 함수
   * @param option (optional) 로그의 prefix를 위한 추가 정보
   * @returns 로그를 구분할 수 있는 prefix
   */
  private getPrefix(option?: { className?: string; functionName?: string }) {
    // constructor에서 생성된 requestId를 prefix의 가장 앞에 부여
    let prefix = this.requestId;

    // option이 존재할 경우 추가 정보를 prefix에 부여
    if (option) {
      if (option.className) prefix = `${prefix} # ${option.className}`;
      if (option.functionName) prefix = `${prefix} # ${option.functionName}`;
    }

    // 이메일이 존재할 경우 prefix에 부여
    if (this.email) prefix = `${prefix} # ${this.email}`;

    // prefix
    return `[${prefix}]`;
  }

  private processMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return message;
  }
}
