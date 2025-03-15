import { IUser } from "../../model/interface/Iuser";
import { IBaseRepository } from "../interface/IbaseRepositry";
import UserModel from "../../model/implementation/user.model";
import { Types } from "mongoose";

export class BaseRepository implements IBaseRepository {
    async create(userData: IUser): Promise<Omit<IUser, "_id">> {
        try {
            const user = await UserModel.create(userData);
            if (!user) {
                throw new Error('Failed to create user');
            }
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; 
        }
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email }).lean();
        if (!user) return null;
        return {
            ...user,
            _id: user._id.toString()
        } as IUser;
    }

    async findByIdAndUpdate(id: Types.ObjectId, name: string, age: number): Promise<IUser | null> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                { $set: { name, age } },
                { new: true, runValidators: true }
            ).lean();

            if (!updatedUser) return null;

            return {
                ...updatedUser,
                _id: updatedUser._id.toString()
            } as IUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async findAll(): Promise<IUser[]> {
        const users = await UserModel.find({ isAdmin: false }).lean();
        return users.map(user => ({
            ...user,
            _id: user._id.toString()
        })) as IUser[];
    }

    async findByIdAndDelete(id: Types.ObjectId): Promise<IUser | null> {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(id).lean();
            if (!deletedUser) return null;
            
            return {
                ...deletedUser,
                _id: deletedUser._id.toString()
            } as IUser;
        } catch (error) {
            console.error('Database Error:', error);
            throw new Error('Error deleting user from database');
        }
    }

    async findByIdAndUpdatePicture(id: Types.ObjectId, picturePath: string): Promise<IUser | null> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                { image: picturePath },
                { new: true, runValidators: true }
            ).lean();

            if (!updatedUser) return null;

            return {
                ...updatedUser,
                _id: updatedUser._id.toString()
            } as IUser;
        } catch (error) {
            console.error('Error updating user profile picture:', error);
            throw error;
        }
    }
    
    
}