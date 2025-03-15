import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, Router } from 'express';
const ALLOWED_FILE_TYPES = ['.jpg', '.jpeg', '.png'] as const;
type AllowedFileTypes = typeof ALLOWED_FILE_TYPES[number];
class FileValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileValidationError';
    }
}

interface MulterConfig {
    storage: multer.StorageEngine;
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void;
    limits?: {
        fileSize?: number; // in bytes
        files?: number;
    };
}

const uploadDir = path.join(__dirname, '../uploads/');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const multerConfig: MulterConfig = {
    storage: multer.diskStorage({
        destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
            cb(null, uploadDir);
        },
        filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        }
    }),
    fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const ext = path.extname(file.originalname).toLowerCase() as AllowedFileTypes;
        
        if (!ALLOWED_FILE_TYPES.includes(ext)) {
            return cb(new FileValidationError(
                `Only ${ALLOWED_FILE_TYPES.join(', ')} files are allowed`
            ));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 
    }
};

const upload = multer(multerConfig);

export default upload;
export { FileValidationError };