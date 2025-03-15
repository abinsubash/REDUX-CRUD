import { IAdminService } from '../interface/IadminService';
import { IUser } from '../../../model/interface/Iuser';
import { IBaseRepository } from '../../../repository/interface/IbaseRepositry';
import { comparePassword, hashPassword } from "../../../utils/bcrypt.util";
import { Types } from 'mongoose';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt.util';

export class AdminService implements IAdminService {
    constructor(private readonly baseRepository: IBaseRepository) {}

    async getAllUsers(): Promise<IUser[]>{
        return await this.baseRepository.findAll();
    }
    async createUser(userData: IUser): Promise<IUser> {
        const existingUser = await this.baseRepository.findByEmail(userData.email);
            if (existingUser) {
                    throw new Error('Email already exists');
                }
        
            const hashedPassword = await hashPassword(userData.password);
            const userDataWithHash = { ...userData, password: hashedPassword };
        
            const user = await this.baseRepository.create(userDataWithHash);
            console.log(user)
            return user;
    }
    async editUser(id: Types.ObjectId, name: string, age: string) : Promise<IUser|null>{
        try {
            const updatedUser = await this.baseRepository.findByIdAndUpdate(id, name, Number(age));
    
            if (!updatedUser) {
                return null;
            }
            return updatedUser;
        } catch (error) {
            console.error('Service Error:', error);
            throw new Error('Failed to update user');
        }
    }
    async deleteUser(id: Types.ObjectId): Promise<boolean> {
        try {
            const result = await this.baseRepository.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            console.error('Error in admin service deleteUser:', error);
            return false;
        }
    }

    async login(email: string, password: string) {
        const admin = await this.baseRepository.findByEmail(email);

        if (!admin || !admin.isAdmin) {
            throw new Error('Invalid admin data');
        }

        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            throw new Error('Invalid admin credentials');
        }

       const payload = {id:admin._id,email:admin.email}
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        return {
            admin,
            accessToken,
            refreshToken
        };
    }


}