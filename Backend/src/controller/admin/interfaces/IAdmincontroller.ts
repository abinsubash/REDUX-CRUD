import { Request, Response, NextFunction } from 'express';

export interface IAdminController {
    createUser(req:Request,res:Response,next:NextFunction):Promise<void>
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    editUser(req:Request,res:Response,next:NextFunction):Promise<void>
    deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
}