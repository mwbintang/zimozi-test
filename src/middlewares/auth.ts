import { NextFunction, Request, Response } from 'express';
import * as JwtHelper from '../helpers/jwt_helper';
import { User } from '../models';
import { UserRole } from '../constants/roles';

const authenticate = async (req: any, res: Response, next: NextFunction, roles: string[]) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = JwtHelper.verifyToken(token);

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            throw new Error('User not found');
        }

        if (!roles.includes(user.role)) {
            throw {
              name: 'FORBIDDEN',
              message: "You don't have permission to access this resource."
            }
          }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
}; 

export const authAllRole = async (req: Request, res: Response, next: NextFunction) => {
    await authenticate(req, res, next, [
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.USER
    ])
}

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    await authenticate(req, res, next, [
        UserRole.ADMIN
    ])
}

export const authAdminManager = async (req: Request, res: Response, next: NextFunction) => {
    await authenticate(req, res, next, [
        UserRole.ADMIN,
        UserRole.MANAGER
    ])
}