# steem-account

steem blockchain 무료 계정 생성 플랫폼

## 구성

express + pug(view) 로 구성됨

## 설치

```sh
npx degit https://github.com/wonsama/steem-account steem-account
cd steem-account
npm i
```

## 환경설정

.env.sample 을 참조하여 .env 파일을 생성한다

## 실행

사전에 [pm2](https://pm2.keymetrics.io/) 를 설치해야 됨 `npm install pm2 -g`

또는 `node ./bin/www` 으로 실행 할 수 있음

```sh
pm2 start
```

## 확인

- [localhost:3000](http://localhost:3000) 으로 접속하면 기본 화면 확인 가능

## 참조

- [pugjs](https://pugjs.org/)
- [expressjs : generator](https://expressjs.com/ko/starter/generator.html)
- [bootstrap : getting-started](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
- [Meta-Tag-OG오픈그래프-사용하기](https://velog.io/@byeol4001/Meta-Tag-OG%EC%98%A4%ED%94%88%EA%B7%B8%EB%9E%98%ED%94%84-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)

- [docker-compose-ssl](http://52.78.22.201/tutorials/weplanet/docker-compose-ssl/)
- [임시주소 : http://158.247.203.31:3000](http://158.247.203.31:3000)
