<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Descripcion

API desarrolada con el framework de [Nest](https://nestjs.com/) con [TypeScript](https://www.typescriptlang.org/).<br/>
Esta se encarga de obtener los datos de la api publica de Star Wars [SWAPI](https://swapi.dev/). La API cuenta con endpoints para recuperar la informacion de:
- **Personajes 👨‍👩‍👧‍👧**
- **Peliculas 📹**
- **Naves 🚀**
- **Planetas 🪐.**


Deployada en [Railway](https://railway.app/) y se puede acceder a ella en el siguiente [link](https://conexa-api-production.up.railway.app/api/v1) de ser necesario. Luego del proceso de instalacion se recomienda probar la API con la siguiente coleccion de postman: <br/><br/> 
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/19593363-69dfb404-9c47-41bc-9017-2d5fcb2df620?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D19593363-69dfb404-9c47-41bc-9017-2d5fcb2df620%26entityType%3Dcollection%26workspaceId%3Dcc9a4f89-fca5-4ed5-b51d-44581036ffc6)


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
```

