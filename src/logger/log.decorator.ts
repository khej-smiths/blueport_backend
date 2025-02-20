async function asyncMainWrapperFn(
  method: string,
  target: any,
  originalMethod: Function,
  ...args: any
): Promise<any> {
  // 에러에서 사용할 수 있도록 prefix 우선 할당
  const prefix = `${this.constructor.name} - ${method}`;

  // als에서 logger 가져오기
  const customLogger = this.als.getStore()!.customLogger;

  // 해당 클래스에 logger가 있을 경우, input을 로그로 남긴다.
  if (customLogger) {
    customLogger.customLog(
      { input: args },
      { className: target.name, methodName: method },
    );
  }

  // this 바인딩
  Object.defineProperty(target.prototype[method], 'name', {
    value: method,
  });

  let result: any;

  try {
    // 기존 메소드를 실행한다.
    // result = await originalMethod.apply(this, args);
    result = await originalMethod.apply(this, args);
  } catch (error) {
    // 만약 에러가 발생한 경우, 그 에러가 custom으로 생성된 에러인 경우 prefix 를 추가한다.
    if (error.extensions?.customFlag) {
      error.addBriefStacktraceToCode(prefix);
    }
    throw error;
  }

  // 실제 함수의 결과를 리턴
  return result;
}

function syncMainWrapperFn(
  method: string,
  target: any,
  originalMethod: Function,
  ...args: any
): any {
  // 에러에서 사용할 수 있도록 prefix 우선 할당
  const prefix = `${this.constructor.name} - ${method}`;

  // als에서 logger 가져오기
  const customLogger = this.als.getStore()!.customLogger;

  // 해당 클래스에 logger가 있을 경우, input을 로그로 남긴다.
  if (customLogger) {
    customLogger.customLog(
      { input: args },
      { className: target.name, methodName: method },
    );
  }

  // this 바인딩
  Object.defineProperty(target.prototype[method], 'name', {
    value: method,
  });

  let result: any;

  try {
    // 기존 메소드를 실행한다.
    // result = await originalMethod.apply(this, args);
    result = originalMethod.apply(this, args);
  } catch (error) {
    // 만약 에러가 발생한 경우, 그 에러가 custom으로 생성된 에러인 경우 prefix 를 추가한다.
    if (error.extensions?.customFlag) {
      error.addBriefStacktraceToCode(prefix);
    }
    throw error;
  }

  // 실제 함수의 결과를 리턴
  return result;
}

/**
 * @description
 * Class Decorator - Wrapper
 * 역할
 * 1. IO Logger
 * 2. Error에 prefix 추가 - 함수를 try - catch로 감싸기 때문에, 별도로 커스텀 에러를 추가할게 아니라면, 호출한 쪽에서는 try - catch가 필요하지 않다
 * @returns
 */
export const Wrapper: () => ClassDecorator = () => {
  return (target: any) => {
    // Wrapper 데코레이터가 적용된 클래스의 함수 목록 가져오기
    const methodList = Object.getOwnPropertyNames(target.prototype);

    // Wrapper 데코레이터가 적용된 클래스의 함수 목록을 반복문 돌리기
    methodList.forEach((method: string) => {
      // 현재 반복문의 함수명 가져오기
      const originalMethod = target.prototype[method];

      /**
       * constructor의 경우 클래스 인스턴스를 초기화하는 특별한 함수로 일반 메서드로 간주되지 않는다.
       * 그래서 따로 IO를 감싸는 로그를 감싸지 않고 바로 리턴처리했다.
       * 이게 없을 경우 해당 데코레이터를 사용하는 함수의 this로 constructor의 이름(클래스 이름)에 접근하지 못한다.
       */
      if (method === 'constructor') {
        return;
      }

      // 동기함수인지 비동기 함수인지 확인
      const isAsync = originalMethod.constructor.name === 'AsyncFunction';

      /**
       * [일반함수로 표현한 이유]
       * 화살표 함수의 경우 어떤 객체에서 호출되더라도 함수가 만들어질 때의 this를 사용한다.
       * 이 함수는 class 외부에서 선언되었기 때문에 만약 화살표 함수로 선언할 경우 class 외부인 현 위치의 this를 바라보기 때문에 class의 this에 접근할 수 없어 logger를 사용할 수 없다.
       * 일반 함수로 선언할 경우 함수가 호출된 위치의 this를 사용하기 때문에 class 의 this와 바인딩되어 class 에 있는 Logger를 사용할 수 있다.
       */
      // 현 함수를 바꿔치기하기(logger감싸지고, 에러 처리가 추가된 형태로)
      target.prototype[method] = isAsync
        ? async function (...args: any) {
            return await asyncMainWrapperFn.call(
              this,
              method,
              target,
              originalMethod,
              ...args,
            );
          }
        : function (...args: any) {
            return syncMainWrapperFn.call(
              this,
              method,
              target,
              originalMethod,
              ...args,
            );
          };
    });
  };
};
