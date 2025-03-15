import jwt from 'jsonwebtoken'
import env, { configDotenv } from 'dotenv'
import { JwtPayload } from '../types/jwt.types';

configDotenv()
const ACCESS_KEY = process.env.JWT_ACCESS_SECRET as string
const REFRESH_KEY = process.env.JWT_REFRESH_SECRET as string;

const ACCESS_TOKEN_EXPIRY = "10s";
const REFRESH_TOKEN_EXPIRY = "7d";


export function generateAccessToken(payload:object):string{
    return jwt.sign(payload,ACCESS_KEY,{expiresIn:ACCESS_TOKEN_EXPIRY})
}
export function generateRefreshToken(payload: object): string {
    return jwt.sign(payload, REFRESH_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY });
}
export function verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, ACCESS_KEY);
    } catch (err) {
      console.error(err)
      return null;
    }
  }

  export const verifyRefreshToken = async (token: string): Promise<JwtPayload | null> => {
    try {
      return jwt.verify(token, REFRESH_KEY!) as JwtPayload;
    } catch (error) {
      console.error("Invalid or expired refresh token:", error);
      return null;
    }
  };