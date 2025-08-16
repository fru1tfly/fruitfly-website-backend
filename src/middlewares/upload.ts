import multer from 'multer';
import path from "path";
import fs from 'fs';
import { FruitflyError } from '../config/errors';

const storage = multer.diskStorage({
    
    destination: (req, file, callback) => {
        const fileDestination = decodeURIComponent(req.params.fileDestination);

        console.log(process.env.PUBLIC_FOLDER);

        // Make sure folder exists
        const uploadPath = path.join(process.env.PUBLIC_FOLDER as string, fileDestination);
        fs.mkdirSync(uploadPath, { recursive: true });

        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        // replace filename with current date to prevent duplicates
        callback(null, Date.now() + path.extname(file.originalname));
    },
    
});

export const upload = multer({ storage });