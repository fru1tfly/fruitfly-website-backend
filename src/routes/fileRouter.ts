import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { upload } from '../middlewares/upload';
import * as FileController from '../controllers/fileController';

const router = Router();

router.post(
    '/upload/:fileDestination',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            fileDestination: Joi.string().required()
        }),
        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    upload.single('file'),
    FileController.uploadFile
);

router.post(
    '/delete/:location',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            location: Joi.string().required()
        }),
        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    FileController.deleteFile
);

export default router;