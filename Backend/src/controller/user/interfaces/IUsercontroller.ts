import { Request,Response,NextFunction } from "express";
import { AuthRequest } from "../../../types/jwt.types";

export interface IUsercontroller{
    signup(req:Request,res:Response,next:NextFunction):Promise<void>
    login(req:Request,res:Response,next:NextFunction):Promise<void>
    updateProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    uploadProfilePic(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}