module.exports = {
  APP_NAME: 'API boilerplate',
  BASE_URL: 'http://localhost:4000',
  DATABASE_URL: 'mongodb://localhost:27017/boilerplate_dev',

  JWT_COOKIE_EXPIRES_IN: '30',
  JWT_SECRET: 'secret',
  JWT_EXPIRES_IN: '30d',
  PASSWORD_RESET_TOKEN_EXPIRES_IN: '10',

  EMAIL_FROM: 'hello@api_boilerplate.com',
  EMAIL_HOST: 'smtp.mailtrap.io',
  EMAIL_PORT: '2525',
  EMAIL_USERNAME: 'username',
  EMAIL_PASSWORD: 'password',

  SENDGRID_USERNAME: 'username',
  SENDGRID_PASSWORD: 'password',

  CLOUDINARY_NAME: 'name',
  CLOUDINARY_API_KEY: 'key',
  CLOUDINARY_API_SECRET_KEY: 'secret',
};
