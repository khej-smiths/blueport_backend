/**
 * @description
 * Class Decorator - Wrapper
 * 역할
 * 1. IO Logger
 * 2. Error에 prefix 추가
 * @returns
 */
export const Wrapper: () => ClassDecorator = () => {
  return (target: any) => {
    const methodList = Object.getOwnPropertyNames(target.prototype);

    methodList.forEach((method: string) => {
      const originalMethod = target.prototype[method];

      /**
       * TODO [클래스명 바인딩을 하기위해 발견한 내용] 이 부분에 대한 증거 확보 필요
       * constructor의 경우 클래스 인스턴스를 초기화하는 특별한 함수로 일반 메서드로 간주되지 않는다.
       * 그래서 따로 IO를 감싸는 로그를 감싸지 않고 바로 리턴처리했다.
       * 이게 없을 경우 해당 데코레이터를 사용하는 함수의 this로 constructor의 이름(클래스 이름)에 접근하지 못한다.
       */
      if (method === 'constructor') {
        return;
      }

      /**
       * [일반함수로 표현한 이유]
       * 화살표 함수의 경우 어떤 객체에서 호출되더라도 함수가 만들어질 때의 this를 사용한다.
       * 이 함수는 class 외부에서 선언되었기 때문에 만약 화살표 함수로 선언할 경우 class 외부인 현 위치의 this를 바라보기 때문에 class의 this에 접근할 수 없어 logger를 사용할 수 없다.
       * 일반 함수로 선언할 경우 함수가 호출된 위치의 this를 사용하기 때문에 class 의 this와 바인딩되어 class 에 있는 Logger를 사용할 수 있다.
       */

      target.prototype[method] = async function (...args: any) {
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

        // 기존 메소드를 실행한다.
        const result = await originalMethod.apply(this, args);

        // 해당 클래스에 logger가 있을 경우, output을 로그로 남긴다.
        if (customLogger) {
          customLogger.customLog(
            { output: result },
            { className: target.name, methodName: method },
          );
        }

        // 리턴
        return result;
      };
    });
  };
};
