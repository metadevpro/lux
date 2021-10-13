# Lux Demo

[![npm version](https://badge.fury.io/js/%40metadev%2Flux.svg)](https://badge.fury.io/js/%40metadev%2Flux)
[![Build Status](https://travis-ci.com/metadevpro/lux.svg?branch=devel)](https://travis-ci.com/metadevpro/lux)
[![Dependencies Status](https://david-dm.org/metadevpro/lux/status.svg)](https://david-dm.org/metadevpro/lux)
[![codecov](https://codecov.io/gh/metadevpro/lux/branch/devel/graph/badge.svg)](https://codecov.io/gh/metadevpro/lux)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Lux is an Angular library with User Interface components.

## Install

From npmjs: [@metadev/lux](https://www.npmjs.com/package/@metadev/lux)

`npm i @metadev/lux`

## Documentation and samples

See [online documentation](https://metadev-lux.herokuapp.com/).

## Local setup

Clone this repo and then:

```bash
npm i
npm test
ng serve
```

## Code organization

1. Library source code is under `projects/lux/` folder.
2. Sample project documenting the library under `src/` folder.

## Debug

In order to debug Lux in a target app by bringing local changes made to Lux's code to an app that uses Lux, run the following commands in Lux's directory:

```bash
npm run build:lux
cd dist/lux
npm pack
```

And then the following in the target app's directory, replacing `lux.directory` with Lux's directory:

```bash
npm install lux.directory/dist/lux/metadev-lux-version.tgz
```

And then build and run the target app.

## Contributors

- [Channel Salas](https://github.com/Chanell13)
- [Jesus Rodríguez](https://github.com/foxandxss)
- [Hector Rivas](https://github.com/hector23rp)
- [Javier Centeno](https://github.com/JavierCenteno)
- [Pedro J. Molina](https://github.com/pjmolina)

## Copyright and License

- Created and mantained by [Metadev](https://metadev.pro).
- Distributed under [MIT license](LICENSE).
