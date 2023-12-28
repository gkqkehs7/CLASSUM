## STEP1

```jsx
$ npm install
```

먼저 패키지들을 생성해주세요

## STEP2

`src/config/env`안에 `.development.env` 파일과 `.production.env` 파일을 생성해주세요.

```jsx
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=

JWT_SECRET=
```

각 `env` 파일 안에 해당 변수들을 작성해주세요.


## STEP3

```jsx
npm run start:dev
```

`development` 환경으로 실행하려면 위 명령어를 실행해주세요.

<br/>

```jsx
npm run start:prod
```

`production` 환경으로 실행하려면 위 명령어를 실행해주세요.
