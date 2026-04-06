import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  baseURL: process.env.BASE_URL!,
  credentials: {
    email: process.env.USER_EMAIL!,
    password: process.env.USER_PASSWORD!,
    otp: process.env.OTP!
  },
  merchant: {
    id: process.env.MERCHANT_ID!
  }
};