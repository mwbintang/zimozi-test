import bcrypt from 'bcryptjs';

export class PasswordHelper {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a password using bcrypt
   * @param password Plain text password
   * @returns Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param plainPassword Plain text password to check
   * @param hashedPassword Hashed password from database
   * @returns boolean indicating if passwords match
   */
  static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if a password meets minimum requirements
   * @param password Password to validate
   * @returns Object with validation result and message
   */
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: 'Password is valid' };
  }
} 