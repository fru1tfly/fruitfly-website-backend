import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import * as UserController from '../controllers/userController';

const router = Router();

router.post(
    '/signup', 
    celebrate({
        [Segments.BODY]: Joi.object({
            username: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    }), 
    UserController.createUser
);

router.post(
    '/login', 
    celebrate({
        [Segments.BODY]: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }), 
    UserController.loginUser
);

router.post(
    '/logout', 
    UserController.logoutUser
);

export default router;