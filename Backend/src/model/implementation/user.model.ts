import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/Iuser";

export interface IuserModel extends mongoose.Document, Omit<IUser, '_id'> {}

const userSchema = new Schema<IuserModel>({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    image: {
        type: String, 
        default: "",    
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model<IuserModel>('User', userSchema);
export default UserModel;
