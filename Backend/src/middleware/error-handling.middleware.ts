import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/status.constants";
import { error } from "console";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Middleware error",err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: err.message,
    });
};

export default errorHandler;