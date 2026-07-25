import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'EduCore Auth Service',

  env: process.env.NODE_ENV || 'development',

  port: parseInt(process.env.PORT || '3001', 10),

  apiPrefix: process.env.API_PREFIX || 'api',

  apiVersion: process.env.API_VERSION || 'v1',

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  jwt: {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,

  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
}));