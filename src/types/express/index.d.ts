import { Request } from 'express';

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
  }
} 

export interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Adjust the type according to your user object
}