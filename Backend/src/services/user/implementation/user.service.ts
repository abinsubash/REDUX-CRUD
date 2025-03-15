import { IUser } from "../../../model/interface/Iuser";
import { IUserService } from "../interfaces/IuserService";
import { IBaseRepository } from "../../../repository/interface/IbaseRepositry";
import { comparePassword, hashPassword } from "../../../utils/bcrypt.util";
import { Types } from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt.util";
// import { BadRequestError } from "../../../utils/errors/CustomError";

export class UserService implements IUserService {
    constructor(private readonly BaseRepository: IBaseRepository) {}

    async signup(userData: Omit<IUser, '_id'>): Promise<IUser> {
        const existingUser = await this.BaseRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await hashPassword(userData.password);
        const userDataWithHash = { ...userData, password: hashedPassword };

        const user = await this.BaseRepository.create(userDataWithHash);
        return user;
    }
    async login(email: string, password: string): Promise<{user:IUser,accessToken:string,refreshToken:string}> {
        const user = await this.BaseRepository.findByEmail(email)
        if(!user){
            console.log('use doesnot exist')
           throw new Error("user doesont exist")
        }

        const correctPassowrd = await comparePassword(password,user.password)
        if(!correctPassowrd){
            console.log('wrong passwod')
            throw new Error("wrong password")
        }
        const payload = {id:user._id,email:user.email}
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        return {user,accessToken,refreshToken}
    }
    async updateProfile(id: Types.ObjectId, name: string, age: number): Promise<IUser> {
        const updatedUser = await this.BaseRepository.findByIdAndUpdate(id, name, age);
        if (!updatedUser) {
            throw new Error('Failed to update user profile');
        }
        
        // Return clean user object
        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            age: updatedUser.age,
            password: updatedUser.password,
            isAdmin: updatedUser.isAdmin
        } as IUser;
    }
    async uploadProfile(id: Types.ObjectId, profilePicture: Express.Multer.File): Promise<IUser> {
        if (!profilePicture) {
            throw new Error('Profile picture is required');
        }

        // Get the file path
        const picturePath = profilePicture.path;

        // Update user with new profile picture
        const updatedUser = await this.BaseRepository.findByIdAndUpdatePicture(id, picturePath);
        
        if (!updatedUser) {
            throw new Error('Failed to update profile picture');
        }

        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            age: updatedUser.age,
            image: updatedUser.image,
            password: updatedUser.password,
            isAdmin: updatedUser.isAdmin
        } as IUser;
    }
    
}