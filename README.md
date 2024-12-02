<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This project is a backend application built with **NestJS** that manages movies and series. It uses the public Star Wars API to gather information about movies and has developed a RESTful API to manage movies, users, and authentication via JWT.

## Features

- **Authentication and Authorization**: JWT-based authentication with user roles (Regular and Admin).
- **User Management**: Endpoints for user registration, login, and management.
- **Movie Management**: Endpoints to get, create, update, and delete movies. Only administrators can modify and delete movies.
- **Movie Synchronization**: Endpoint or cron job to synchronize the movie list with the public Star Wars API.
- **Unit Tests**: Comprehensive tests for the endpoints and business logic.
- **API Documentation**: API documentation generated using Swagger.

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** ()

## Installation

```bash
$ yarn install
```

## Docs

```swagger
# Swagger
http://localhost:8080/docs
```

```swagger
# Postman
Postman file is in folder
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
$ yarn run test:unit

# e2e tests
$ yarn run test:e2e

```

## License

Nest is [MIT licensed](LICENSE).
