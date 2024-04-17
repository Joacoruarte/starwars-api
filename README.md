<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Star Wars Api


### Descripcion del projecto

API desarrolada con el framework de [Nest](https://nestjs.com/) con [TypeScript](https://www.typescriptlang.org/).<br/>
Esta se encarga de obtener los datos de la API publica de Star Wars [SWAPI](https://swapi.dev/). La API cuenta con endpoints para recuperar la informacion de:
- **Personajes 👨‍👩‍👧‍👧**
- **Peliculas 📹**
- **Naves 🚀**
- **Planetas 🪐.**


Deployada en [Railway](https://railway.app/) y se puede acceder a ella en el siguiente [link](https://conexa-api-production.up.railway.app/api/v1) de ser necesario. Luego del proceso de instalacion se recomienda probar la API con la siguiente coleccion de postman: <br/><br/> 
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://www.postman.com/universal-rocket-821238/workspace/public-apis-joaquin-ruarte/request/19593363-130a3b94-c0f7-4f16-aec4-1f3a5b233cca)


## Pre-requisitos


#### Verificar version de Node.js instalada (>= 16)


```bash
$ node -v 
```

#### Tener Nest CLI instalado

```bash
$ npm i -g @nestjs/cli
```


## Instalacion

```bash
$ npm install
```

## Variables de entorno
Clonar el archivo ```.env.example``` y renombrarlo a ```.env```

```bash
$ cp .env.example .env
```

## Correr la app

```bash
# Entorno de desarrollo
$ npm run start

# Entorno de desarrollo en modo watch
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test
```

