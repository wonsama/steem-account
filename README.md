# steem-account

steem blockchain 무료 계정 생성 플랫폼

## 구성 및 설치

> express + pug(view) 로 구성됨

(설치)

```sh
git clone https://github.com/wonsama/steem-account
cd steem-account
npm install 
```

(환경설정)

> .env.sample 을 참조하여 .env 파일을 생성한다

(실행)

`npm start`

## 확인

> [localhost:3000](http://localhost:3000) 으로 접속하면 기본 화면 확인 가능

## 실행 with pm2

`pm2 start ./bin/www --name steem-account`

## TODO

* 소스정리 - js 소스 정리 요망
* `TODO :` 로 마킹된 부분 update
* bootstrap 에서 다른 f/w 으로 바꿔야 되려나 ??
* 부족한 계정 생성 토큰은 수급이 필요할 수도 있음

## 참조

* [expressjs : generator](https://expressjs.com/ko/starter/generator.html)
* [bootstrap : getting-started](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
* [Meta-Tag-OG오픈그래프-사용하기](https://velog.io/@byeol4001/Meta-Tag-OG%EC%98%A4%ED%94%88%EA%B7%B8%EB%9E%98%ED%94%84-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)