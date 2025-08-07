import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { createUser, loginUser, logoutUser } from '../controllers/userController';

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
    createUser
);

router.post(
    '/login', 
    celebrate({
        [Segments.BODY]: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }), 
    loginUser
);

router.post(
    '/logout', 
    logoutUser
);

export default router;