import { Types } from "mongoose";
import { IUser } from "../../../model/interface/Iuser";

export interface IAdminService {
    createUser(userData:IUser):Promise<IUser>
    getAllUsers(): Promise<IUser[]>;
    editUser(id:Types.ObjectId,name:string,age:string): Promise<IUser|null>;
    deleteUser(id: Types.ObjectId): Promise<boolean>;
    login(email: string, password: string): Promise<{
        admin: IUser;
        accessToken: string;
        refreshToken: string;
    }>;
}