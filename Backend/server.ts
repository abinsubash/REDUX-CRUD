import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import User_router from './src/routes/user-router';
import Admin_routes from './src/routes/admin-router';
import { connectDb } from './src/config/mongo.config';
import errorHandler from './src/middleware/error-handling.middleware';
import path from 'path';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

connectDb();

app.use('/uploads', express.static(path.join(__dirname, './src/uploads')));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', User_router);
app.use('/admin', Admin_routes);
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});