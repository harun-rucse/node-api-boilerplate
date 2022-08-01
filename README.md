# Node API boilerplate

### Description:

This is a Test-driven development (TDD) RESTful API development stater kit. Basic authentication and authorization with `jsonwebtoken` and also implement email sending functionality for email verification and forgot password using `nodemailer`. `mongoose` ODM is use for working with mongoDB database. Proper error handling using express error handling middleware and also use `Joi` package, the most powerful schema description language and data validator for JavaScript.
Image upload to the cloudinary cloud storage using `multer` and `cloudinary` api

---

### Testing:

`Jest` and `supertest` library is used for automated unit and integration testing.
`mongodb-memory-server` is used as a memory database for testing purpose.

## Installation

- Copy .env.example to .env in the src directory

```
  copy src/.env.example src/.env
```

- Copy dev.config.example.js to dev.config.js in the src/config directory

```
  copy src/config/dev.config.example.js src/config/dev.config.js
```

- Install dependency using `yarn` or `npm` package manager

```
yarn install
```

- After install run mongo server then.

- Run as development mode

```
yarn run dev
```

- Run as production mode

```
yarn run prod
```

- Run test

```
yarn test
```

## API Endpoints:

### Auth routes

```
POST /api/auth/register [public]
```

```
POST/api/auth/login [public]
```

```
POST /api/auth/forgot-password [public]
```

```
PATCH /api/auth/reset-password/:resetToken [public]
```

```
PATCH /api/auth/verify-email/:token [public]
```

```
PATCH /api/auth/update-password [private]
```

### User routes

```
GET /api/users/my-profile [private]
```

```
PATCH /api/users/update-me [private]
```

```
GET /api/users [admin]
```

```
POST /api/users [admin]
```

```
GET /api/users/:id [admin]
```

```
PATCH /api/users/:id [admin]
```

```
DELETE /api/users/:id [admin]
```
