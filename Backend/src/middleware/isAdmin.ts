import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/jwt.types';

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Check if user exists in request (set by verifyJWT middleware)
        if (!req.user) {
            throw new Error('Not authenticated');
        }

        // Check if user is admin
        if (!req.user.isAdmin) {
            throw new Error('Not authorized. Admin access required');
        }

        next();
    } catch (error) {
        next(error);
    }
};