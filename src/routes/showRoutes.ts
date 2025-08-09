import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import * as ShowController from '../controllers/showController';

const router = Router();

router.get(
    ['/upcoming', '/upcoming/:showCount'],
    ShowController.getUpcomingShows
);

const optionalShowFields = {
    showName: Joi.string(),
    imgUrl: Joi.string().uri({ allowRelative: true }),
    otherActs: Joi.string(),
    doorsTime: Joi.string(),
    showTime: Joi.string(),
    setTime: Joi.string(),
    ticketUrl: Joi.string().domain(),
    price: Joi.string()
};

router.post(
    '/create',
    celebrate({
        [Segments.BODY]: Joi.object({
            ...optionalShowFields,
            venue_id: Joi.number().required(),
            date: Joi.number().required()
        }),
        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    ShowController.createShow
);

router.put(
    '/update',
    celebrate({
        [Segments.BODY]: Joi.object({
            ...optionalShowFields,
            id: Joi.number().required(),
            venue_id: Joi.number(),
            date: Joi.number()
        }),
        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    ShowController.updateShow
);

router.delete(
    '/delete',
    celebrate({
        [Segments.BODY]: Joi.object({
            id: Joi.number().required()
        }),
        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    ShowController.deleteShow
);

export default router;