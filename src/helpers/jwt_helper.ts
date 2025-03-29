import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ApiError } from './api_error';

export class JwtHelper {
  private static readonly JWT_SECRET = process.env.JWT_SECRET;
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
  private static readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  private static readonly REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

  /**
   * Generate a JWT token
   * @param payload Data to be encoded in the token
   * @returns JWT token
   */
  static generateToken(payload: any): string {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    return jwt.sign(payload, this.JWT_SECRET as Secret, {
      expiresIn: this.JWT_EXPIRES_IN
    } as SignOptions);
  }

  /**
   * Verify a JWT token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  static verifyToken(token: string): any {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    try {
      return jwt.verify(token, this.JWT_SECRET as Secret);
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  }

  static generateRefreshToken(user: any): string {
    if (!this.REFRESH_TOKEN_SECRET) {
      throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }
    
    return jwt.sign(
      { id: user._id },
      this.REFRESH_TOKEN_SECRET as Secret,
      {
        expiresIn: this.REFRESH_TOKEN_EXPIRES_IN
      } as SignOptions
    );
  }

  /**
   * Extract token from Authorization header
   * @param authHeader Authorization header string
   * @returns JWT token
   */
  static extractToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }
    return authHeader.split(' ')[1];
  }
} 