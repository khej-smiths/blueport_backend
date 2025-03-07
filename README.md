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

## DB

```
$ docker-compose -f mysql-docker-compose.yml up -d
```

## Rule

```
- 주석은 최대한 라인마다 작성
- Entity의 역할을 하는 클래스는 Abstract Class로 선언하고 클래스를 상속받아 Gql의 InputType 클래스와 ObjectType 클래스를 구현
- API 및 함수 이름은 최대한 CRUD를 살려서 선정
```

## Note

```
1. swc compiler - tsc보다 속도가 빠른 swc 컴파일러 적용
2. log - Async Local Storage를 이용해 request 별 로그를 작성하고, 각 함수를 감싸는 wrapper용 함수를 만들어 IO 로그의 중복 최소화
```
