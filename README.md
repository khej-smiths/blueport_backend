## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Rule

```
- 주석은 최대한 라인마다 작성
- Entity의 역할을 하는 클래스는 Abstract Class로 선언하고 클래스를 상속받아 Gql의 InputType 클래스와 ObjectType 클래스를 구현
```

## Note

```
1. swc compiler - tsc보다 속도가 빠른 swc 컴파일러 적용
```
