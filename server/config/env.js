import dotenv from "dotenv";
import path from "path";

const loadEnv = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

if (loadEnv.error) {
  console.log(`failed to load .env files`, loadEnv.error);
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || 5000,

  MONGODB_URI: process.env.MONGODB_URI,
  TEST_URI: process.env.LOCAL_MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  CLIENT_URL: process.env.CLIENT_URL,
  NGINX_URL: process.env.NGINX_URL,

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_TO: process.env.EMAIL_TO,
};
