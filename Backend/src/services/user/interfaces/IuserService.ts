import { Types } from 'mongoose';
import { IUser } from '../../../model/interface/Iuser';

export interface IUserService {
    signup(userData: IUser): Promise<IUser>;
    login(email: string, password: string): Promise<{
        user:IUser,
        accessToken: string;
        refreshToken: string;
    }>;
    updateProfile(id: Types.ObjectId, name: string, age: number): Promise<IUser>;
    uploadProfile(id: Types.ObjectId, profilePicture: Express.Multer.File): Promise<IUser>;
}
