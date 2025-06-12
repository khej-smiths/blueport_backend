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

## 운영정보

1. 로컬에서 도커 이미지 빌드 후 docker-hub에 푸시

```bash
    # 1. docker-compose를 이용해 이미지 빌드
    $ docker-compose build app

    # 2. docker login
    $ docker login

    #3. 빌드한 이미지를 docker-hub에 푸시
    $ docker push deveunjilee/app:latest
```

2. aws lightsail에서 docker-hub 이미지를 가져온 후 띄우기

```bash
    # docker-hub에서 빌드된 이미지 가져오기
    $ docker pull deveunjilee/app:latest

    # 인스턴스에서 도커 띄우기
    $ docker-compose up -d app
```

3. 주의사항: 이미지 빌드 할 때, 환경변수, 브랜치 등등을 잘 확인해야함

## 기존 컨테이너와 이미지 모두 깨끗하게 삭제하고 싶을 때

```
docker-compose down --rmi all
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
3. error - 각 클래스를 감싸는 wrapper 함수에서 함수의 전체 error를 감싸서 처리하고 있기 때문에, 특별히 따로 잡아야할 에러가 있는게 아니라면 전체를 관통하는 에러처리는 필요없음
```
