import { Request, Response, NextFunction } from 'express';
import { IAdminController } from '../interfaces/IAdmincontroller';
import { IAdminService } from '../../../services/admin/interface/IadminService';
import { HttpStatus } from '../../../constants/status.constants';
import { Types } from 'mongoose';

export class AdminController implements IAdminController {
    constructor(private readonly adminService: IAdminService) {}

    getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log('hi')
            const users = await this.adminService.getAllUsers();
            
            res.status(HttpStatus.OK).json({
                status: 'success',
                users
            });
        } catch (error) {
            next(error);
        }
    };

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = req.body;
            const newUser = await this.adminService.createUser(userData);

            res.status(201).json({
                status: 'success',
                message: 'User created successfully',
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    age: newUser.age,
                }
            });
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(400).json({
                    status: 'error',
                    message: 'Email already exists'
                });
                return;
            }
            next(error);
        }
    };

    editUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, age } = req.body;
            console.log(name, age, id);
    
            const userId = new Types.ObjectId(id);
            const editedUser = await this.adminService.editUser(userId, name, age);
    
            if (editedUser) {
                res.status(200).json({
                    status: 'success',
                    message: 'User updated successfully',
                    data: editedUser
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error('Error editing user:', error);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong while updating the user'
            });
        }
    };
    
    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = new Types.ObjectId(id);
    
            const isDeleted = await this.adminService.deleteUser(userId);
    
            if (isDeleted) {
                res.status(200).json({
                    status: 'success',
                    message: 'User deleted successfully'
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong while deleting the user'
            });
        }
    };
    
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            console.log(req.body) 
            const { admin, accessToken, refreshToken } = await this.adminService.login(email, password);

            res.cookie('jwtRefreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            res.status(HttpStatus.OK).json({
                status: 'success',
                message: 'Admin logged in successfully',
                admin: {
                    _id: admin._id,
                    email: admin.email,
                    isAdmin: admin.isAdmin
                },
                accessToken
            });
        } catch (error) {
            next(error);
        }
    };

    // dashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         // Add dashboard logic here
    //         res.status(HttpStatus.OK).json({
    //             status: 'success',
    //             message: 'Welcome to admin dashboard'
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // };

    // blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const { id } = req.params;
    //         const updatedUser = await this.adminService.toggleUserBlock(id);
            
    //         res.status(HttpStatus.OK).json({
    //             status: 'success',
    //             message: `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    //             user: updatedUser
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // };
}