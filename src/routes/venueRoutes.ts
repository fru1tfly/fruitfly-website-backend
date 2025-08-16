import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import * as VenueController from '../controllers/venueController';

const router = Router();

router.get(
    '/',
    celebrate({
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    VenueController.getAllVenues
);

router.get(
    ['/search/', '/search/:searchTerm'],
    celebrate({
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    VenueController.getFromSearchTerm
);

const optionalVenueFields = {
    address: Joi.string(),
    city: Joi.string(),
    ageRestriction: Joi.string()
};

router.post(
    '/create',
    celebrate({
        [Segments.BODY]: Joi.object({
            ...optionalVenueFields,
            venueName: Joi.string().required()
        }),
        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    VenueController.createVenue
);

router.post(
    '/edit',
    celebrate({
        [Segments.BODY]: Joi.object({
            ...optionalVenueFields,
            id: Joi.number().required(),
            venueName: Joi.string()
        }),
        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    VenueController.updateVenue
);

router.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            id: Joi.number().required()
        }),
        // requires authentication
        [Segments.HEADERS]: Joi.object({
            token: Joi.string().required()
        }).unknown()
    }),
    VenueController.deleteVenue
);

export default router;