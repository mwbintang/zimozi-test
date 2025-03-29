import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { success } from '../helpers/response_json';
import { AuthenticatedRequest } from "../types/express"

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        const role = req.body.role || "User"
        const result = await authService.register(email, password, name, role);

        success(res, 201, "User registered successfully", result);
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        success(res, 200, "Success login", result);
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const { currentPassword, newPassword } = req.body;
        const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
        success(res, 200, "Password updated successfully", result);
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        success(res, 200, "Reset token sent", result);
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, password } = req.body;
        const result = await authService.resetPassword(token, password);
        success(res, 200, "Password reset successful", result);
    } catch (error) {
        next(error);
    }
}

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const result = await authService.getCurrentUser(req.user.id);
        success(res, 200, "User retrieved successfully", result);
    } catch (error) {
        next(error);
    }
}

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const result = await authService.logout(req.user.id);
        success(res, 200, "Logout successful", result);
    } catch (error) {
        next(error);
    }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        
        success(res, 200, "Token refreshed", result);
    } catch (error) {
        next(error);
    }
}

