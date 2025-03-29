import * as jwt from 'jsonwebtoken';
import { ApiError } from './api_error';

export class JwtHelper {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = '24h';

  /**
   * Generate a JWT token
   * @param payload Data to be encoded in the token
   * @returns JWT token
   */
  static generateToken(payload: any): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  /**
   * Verify a JWT token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  }

  /**
   * Extract token from Authorization header
   * @param authHeader Authorization header string
   * @returns JWT token
   */
  static extractToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }
    return authHeader.split(' ')[1];
  }
} 