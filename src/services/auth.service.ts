import { User } from '../models';
import * as JwtHelper from '../helpers/jwt_helper';
import { PasswordHelper } from '../helpers/password_helper';

export const authService = {
    register: async (email: string, password: string, name: string, role: string) => {
        const passwordValidation = PasswordHelper.validatePassword(password);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = await User.create({ email, password, name, role });
        const token = JwtHelper.generateToken({ id: user._id });
        const refreshToken = JwtHelper.generateRefreshToken({ id: user._id });
        await User.findByIdAndUpdate(user._id, { $set: { refreshToken } });

        return {
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    },

    login: async (email: string, password: string) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = JwtHelper.generateToken({ id: user._id });
        const refreshToken = JwtHelper.generateRefreshToken({ id: user._id });

        await User.findByIdAndUpdate(user._id, { $set: { refreshToken } });

        return {
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    },

    refreshToken: async (refreshToken: string) => {
        const decoded = JwtHelper.verifyToken(refreshToken);
        const user = await User.findOne({ _id: decoded.id, refreshToken });
        if (!user) {
            throw new Error('Invalid refresh token');
        }

        const token = JwtHelper.generateToken({ id: user._id });
        const newRefreshToken = JwtHelper.generateRefreshToken({ id: user._id });
        await User.findByIdAndUpdate(user._id, { $set: { refreshToken: newRefreshToken } });

        return { token, refreshToken: newRefreshToken };
    },

    changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        const passwordValidation = PasswordHelper.validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }

        user.password = newPassword;
        await user.save();

        return { message: 'Password updated successfully' };
    },

    forgotPassword: async (email: string) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const resetToken = JwtHelper.generateToken({ id: user._id });
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);

        await user.save();

        return { message: 'Password reset token sent to email' };
    },

    resetPassword: async (token: string, password: string) => {
        const decoded = JwtHelper.verifyToken(token);
        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        const passwordValidation = PasswordHelper.validatePassword(password);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return { message: 'Password has been reset' };
    },

    getCurrentUser: async (userId: string) => {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    logout: async (userId: string) => {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        user.refreshToken = null;
        await user.save();
        return user;
    }
};