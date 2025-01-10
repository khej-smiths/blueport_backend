/**
 * @description: Class Decorator - IO마다 로그를 다는 데코레이터
 * @returns
 */
export const IOLogger: () => ClassDecorator = () => {
  return (target: any) => {
    const methodList = Object.getOwnPropertyNames(target.prototype);

    methodList.forEach((method: string) => {
      const originalMethod = target.prototype[method];

      /**
       * [일반함수로 표현한 이유]
       * 화살표 함수의 경우 어떤 객체에서 호출되더라도 함수가 만들어질 때의 this를 사용한다.
       * 이 함수는 class 외부에서 선언되었기 때문에 만약 화살표 함수로 선언할 경우 class 외부인 현 위치의 this를 바라보기 때문에 class의 this에 접근할 수 없어 logger를 사용할 수 없다.
       * 일반 함수로 선언할 경우 함수가 호출된 위치의 this를 사용하기 때문에 class 의 this와 바인딩되어 class 에 있는 Logger를 사용할 수 있다.
       */

      target.prototype[method] = async function (...args: any) {
        // 해당 클래스에 logger가 있을 경우, input을 로그로 남긴다.
        if (this.logger) {
          this.logger.customLog(
            { input: args },
            { className: target.name, methodName: method },
          );
        }

        // 기존 메소드를 실행한다.
        const result = await originalMethod.apply(this, args);

        // 해당 클래스에 logger가 있을 경우, output을 로그로 남긴다.
        if (this.logger) {
          this.logger.customLog(
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
