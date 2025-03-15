import { Types } from "mongoose";
import { IUser } from "../../model/interface/Iuser";

export interface IBaseRepository {
    create(user: IUser): Promise<Omit<IUser, "_id">>;
    findByEmail(email: string): Promise<IUser | null>;
    findByIdAndUpdate(id:Types.ObjectId,name:string,age:number):Promise<IUser | null>
    findAll():Promise<IUser[]>
    findByIdAndDelete(id: Types.ObjectId): Promise<IUser | null>;
    findByIdAndUpdatePicture(id:Types.ObjectId,PicturePath:string):Promise<IUser|null>
}