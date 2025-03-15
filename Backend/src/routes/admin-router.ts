import { Router } from 'express';
import { AdminController } from '../controller/admin/implementation/admin.controller';
import { AdminService } from '../services/admin/implementation/admin.service';
import { BaseRepository } from '../repository/implementation/base.repositry';
import { verifyJWT } from '../middleware/jwt.middlware';
import validate from "../middleware/validate.middleware";
import signupSchema from "../schema/signup-schema";
import updateSchema from "../schema/edit-schema";

const Admin_router = Router();
const baseRepository = new BaseRepository();
const adminService = new AdminService(baseRepository);
const adminController = new AdminController(adminService);

Admin_router.get('/getUsers', adminController.getAllUsers);
Admin_router.post('/createUser', validate(signupSchema), adminController.createUser);
Admin_router.patch('/editUser/:id', validate(updateSchema), adminController.editUser);
Admin_router.delete('/deleteUser/:id', adminController.deleteUser);
Admin_router.post('/login', adminController.login);

export default Admin_router;