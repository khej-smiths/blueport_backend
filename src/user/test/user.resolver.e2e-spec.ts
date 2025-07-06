import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 계정 생성
  it('should create a user', async () => {
    const mutation = `
      mutation CreateUser($input: CreateUserInputDto!) {
        createUser(input: $input) {
          id
          email
          name
        }
      }
    `;

    const variables = {
      input: {
        email: 'test@example.com',
        password: '1234',
        name: '테스트',
      },
    };

    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: mutation,
      variables,
    });

    // 계정이 제대로 생성된 경우 리턴값 확인
    expect(response.body.data.createUser.email).toBe('test@example.com');
    expect(response.body.data.createUser.name).toBe('테스트');

    // TODO 계정이 제대로 생성되지 않은 경우의 에러값 확인
  });
});
