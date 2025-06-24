import { validate } from 'class-validator';
import { User, UserInputType } from '../user.entity';
import argon2 from 'argon2';

describe('User Entity', () => {
  describe('비밀번호 관련', () => {
    it('hashPassword: 비밀번호가 해싱되어야 한다', async () => {
      const user = new User();
      user.password = 'Test1234!';

      await user.hashPassword();

      // 해싱된 후 기존 값이랑 달라졌는지 확인
      expect(user.password).not.toBe('Test1234!');
      // 실제로 argon2로 해싱된 값인지 확인
      const isValid = await argon2.verify(user.password, 'Test1234!');
      expect(isValid).toBe(true);
    });

    describe('UserInputType', () => {
      it('비밀번호가 8자 미만이면 에러가 발생해야 한다', async () => {
        const input = new UserInputType();

        input.name = '홍길동';
        input.email = 'test@example.com';
        input.password = '123abc'; // 비번이 짧음

        const errors = await validate(input);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isLength');
        expect(errors[0].constraints!.isLength).toEqual(
          '비밀번호는 8자 이상 20자 이하이어야 합니다.',
        );
      });

      it('비밀번호가 20자 이상이면 에러가 발생해야 한다', async () => {
        const input = new UserInputType();

        input.name = '홍길동';
        input.email = 'test@example.com';
        input.password = '123abc123abc!@#789123abc123abc!@#789'; // 비번이 짧음

        const errors = await validate(input);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isLength');
        expect(errors[0].constraints!.isLength).toEqual(
          '비밀번호는 8자 이상 20자 이하이어야 합니다.',
        );
      });

      it('비밀번호에 특수문자가 없는 경우 에러가 발생해야 한다.', async () => {
        const input = new UserInputType();

        input.name = '홍길동';
        input.email = 'test@example.com';
        input.password = '123abc123abc'; // 특수문자가 없는 경우

        const errors = await validate(input);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('matches');
        expect(errors[0].constraints!.matches).toEqual(
          '비밀번호는 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
        );
      });

      it('비밀번호에 영문이 없는 경우 에러가 발생해야 한다.', async () => {
        const input = new UserInputType();

        input.name = '홍길동';
        input.email = 'test@example.com';
        input.password = '123123123!'; // 영문이 없는 경우

        const errors = await validate(input);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('matches');
        expect(errors[0].constraints!.matches).toEqual(
          '비밀번호는 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
        );
      });

      it('비밀번호에 숫자가 없는 경우 에러가 발생해야 한다.', async () => {
        const input = new UserInputType();

        input.name = '홍길동';
        input.email = 'test@example.com';
        input.password = 'abcabcabc!'; // 영문이 없는 경우

        const errors = await validate(input);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('matches');
        expect(errors[0].constraints!.matches).toEqual(
          '비밀번호는 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
        );
      });

      it('비밀번호가 조건을 만족하면 통과해야 한다', async () => {
        const input = new UserInputType();
        input.name = '홍길동';
        input.email = 'test@example.com';
        input.password = 'Test1234!';

        const errors = await validate(input);
        expect(errors.length).toBe(0);
      });
    });
  });

  // name 관련

  // email 관련

  // postList 관련

  // blog 관련

  // resume 관련
});
