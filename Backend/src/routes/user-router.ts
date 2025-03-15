import { Router } from "express";
import { UserController } from "../controller/user/implementation/user.controller";
import { UserService } from "../services/user/implementation/user.service";
import { BaseRepository } from "../repository/implementation/base.repositry";
import validate from "../middleware/validate.middleware";
import  signupSchema  from "../schema/signup-schema";
import loginSchema from "../schema/login-schema";
import updateSchema from "../schema/edit-schema";
import { verifyJWT } from '../middleware/jwt.middlware';
import upload from "../config/multer.config";

const User_router = Router();
const userRepository = new BaseRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

User_router.post("/signup", validate(signupSchema), userController.signup);
User_router.post("/login",validate(loginSchema),userController.login)

User_router.put(
    '/updateProfile',
    validate(updateSchema),
    verifyJWT,
    userController.updateProfile
);
User_router.post('/uploadProfilePic',verifyJWT,upload.single('image'),userController.uploadProfilePic)

export default User_router;