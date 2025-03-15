import { NextFunction, Request, Response } from "express";
import { IUserService } from "../../../services/user/interfaces/IuserService";
import { HttpStatus } from "../../../constants/status.constants";
import { HttpResponse } from "../../../constants/responce.message";
import { IUsercontroller } from "../interfaces/IUsercontroller";
import { verifyRefreshToken } from "../../../utils/jwt.util";
import mongoose, { Types } from 'mongoose';
import { AuthRequest, JwtPayload } from '../../../types/jwt.types';
import UserModel from "../../../model/implementation/user.model";
import path from "path";
// import { UnauthorizedError } from '../../../utils/errors/CustomError';

export class UserController implements IUsercontroller {
    constructor(private readonly userService: IUserService) {}

    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.signup(req.body);
            
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'User registered successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            console.log(req.body)
            const {user ,accessToken,refreshToken} = await this.userService.login(email, password);

        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      console.log("This is user data",user,accessToken,refreshToken)
      res.status(HttpStatus.OK).json({user,accessToken }) 
        } catch (error) {
            next(error);
        }
    };

    
    
    updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, age } = req.body;
            console.log("userController ", req.body);

            if (!name || !age || typeof name !== "string" ) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    status: "error",
                    message: "Invalid input. Name must be a string, and age must be a number."
                });
                return;
            }

            if (!req.user?.id) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    status: "error",
                    message: "User not authenticated"
                });
                return;
            }

            const userId = new Types.ObjectId(req.user.id);
            const updatedUser = await this.userService.updateProfile(userId, name, age);

            // Send updated user data in response
            res.status(HttpStatus.OK).json({
                status: "success",
                message: "Profile updated successfully",
                user: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    age: updatedUser.age,
                    _id: updatedUser._id
                }
            });
        } catch (error) {
            next(error);
        }
    };
    uploadProfilePic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'No file uploaded'
                });
                return;
            }

            const userId = req.user?.id;
            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    status: 'error',
                    message: 'User not authenticated'
                });
                return;
            }

            // Get relative path for storage in DB
            const relativePath = path.relative(
                path.join(__dirname, '../../../uploads'),
                req.file.path
            );

            const updatedUser = await this.userService.uploadProfile(
                new Types.ObjectId(userId),
                req.file
            );

            res.status(HttpStatus.OK).json({
                status: 'success',
                message: 'Profile picture updated successfully',
                user: {
                    ...updatedUser,
                    image: `http://localhost:3000/uploads/${relativePath}`
                }
            });
        } catch (error) {
            next(error);
        }
    };
}