<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Setting up the Constants (src/Constants.ts)
```bash
export const CONSTANTS = {
  iqAir: {
    privateLink: //private link to your IQAir device,
    publicLink: // http:/api.airvisual.com/v2/nearest_city?lat=18.85289&lon=98.952845&key= or whatever location you want,
    iqAirKey: //iqAir API Key,
    publicCacheMS: 3600000 //or however long you want to cache (be careful with limits),
    privateCacheMS: 1800000
  },
  google: {
    calendarId: //ID of the calendar (can be extracted with the calendar list on google cloud API tester),
    tasklistId: //ID of the Tasklist (see above),
    cacheMS: 900000
  },
  bring: {
    username: //bring username,
    password: //bring pwd,
    cacheMS: 900000,
    listId: //bring list id, can be extracted by running loadLists
},
  weather: {
    url: //'https://api.openweathermap.org/data/2.5/forecast?id=1153671&units=metric&appid={apikey}',
    //exchange id to your location and apiKey to your key
    cacheMS: 450000,
  },
  crypto: {
    url: //'http://api.coincap.io/v2/rates', other exchanges might have a different api
    baseCurr: //'EUR', currency against which all is converted (API returns to USD)
    symbols: //['BTC', 'ETH', 'CHF'], symbols that should be extracted
    inverseSymbols: //['THB'] symbols to extract baseCurr to inverse instead of symbol to baseCurr
  }
};
```

## Setting up Google Authentication

First you'll need to set up a google Cloud API (enable calendar and tasks)<br>
Then generate an OAuth2 Key (desktop application type), download the key and store it as 'credentials.json' in the root folder.<br>
To make it easier, you can update the credentials.json and replace redirect_uris (or set them in the google cloud):
<br>
"redirect_uris": [
"http://localhost:3000/google/setAccessCode"
]
<br>
Next run the BE and call getAuthorizationUrl function from BE google (with postman or curl), this will return a link<br>
copy the link to a browser on the machine you run it (if you get the link from another host, replace localhost in the redirect uri) <br>
and follow the instructions, after successfully authenticating, it should redirect to the address above and store the token and return 'token stored'


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
