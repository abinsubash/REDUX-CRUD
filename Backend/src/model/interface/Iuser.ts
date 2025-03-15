import { Types } from "mongoose";

export interface IUser {
    _id?: string;  
    name: string;
    age: number;
    email: string;
    password: string;
    isAdmin:boolean;
    image?: string;
}
