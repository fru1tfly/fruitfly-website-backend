import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { createShow, getUpcomingShows } from '../controllers/showController';

const router = Router();

router.get(
    ['/upcoming', '/upcoming/:showCount'],
    getUpcomingShows
);


router.post(
    '/create',
    celebrate({
        [Segments.BODY]: Joi.object({
            venue_id: Joi.number().required(),
            showName: Joi.string(),
            date: Joi.number().required(),
            imgUrl: Joi.string().uri({ allowRelative: true }),
            otherActs: Joi.string(),
            doorsTime: Joi.string(),
            showTime: Joi.string(),
            setTime: Joi.string(),
            ticketUrl: Joi.string().domain(),
            price: Joi.string()
        }),

        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    createShow
);

export default router;