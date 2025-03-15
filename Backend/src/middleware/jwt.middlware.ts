import { Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/status.constants';
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { AuthRequest, JwtPayload } from '../types/jwt.types';

export const verifyJWT =async (req: AuthRequest, res: Response, next: NextFunction): Promise <void> => {
    try {
        console.log("in fooo", req.headers, req.body);
        const accessToken = req.headers.authorization?.split(" ")[1];
        const refreshToken = req.cookies?.refreshToken || req.headers.cookie?.split('refreshToken=')[1]?.split(';')[0];

        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        if (!accessToken || !refreshToken) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'Access token or refresh token not provided'
            });
            return;
        }

        const decodedAccess = verifyAccessToken(accessToken);

        if (typeof decodedAccess === "object" && decodedAccess !== null) {
            req.user = decodedAccess as JwtPayload; 
            next();
            return;
        }
        const decodedRefresh = await verifyRefreshToken(refreshToken) as JwtPayload;

        if (!decodedRefresh) {
             res.status(HttpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'Invalid or expired refresh token'
            });
            return
        }

        const newAccessToken = generateAccessToken({ id: decodedRefresh.id, email: decodedRefresh.email });
        console.log("this is new acces token",newAccessToken)
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);

        req.user = decodedRefresh;
        next();
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'JWT middleware error'
        });
    }
};
