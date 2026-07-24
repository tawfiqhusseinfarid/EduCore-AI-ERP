export default () => ({

  app: {

    name: process.env.APP_NAME,

    port: Number(process.env.PORT),

    env: process.env.NODE_ENV,

  },

  jwt: {

    secret: process.env.JWT_SECRET,

    expiresIn: process.env.JWT_EXPIRES_IN,

  },

  rabbitmq: {

    url: process.env.RABBITMQ_URL,

  },

  redis: {

    host: process.env.REDIS_HOST,

    port: Number(process.env.REDIS_PORT),

  }

});