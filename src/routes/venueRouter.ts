import { ItemRouter } from './itemRouter';
import { Venue } from '../models/Venue';
import { VenueController } from '../controllers/venueController';
import { Joi } from 'celebrate';

const controller = new VenueController();

const requiredFields = {
    venueName: Joi.string()
};

const optionalFields = {
    address: Joi.string(),
    city: Joi.string(),
    ageRestriction: Joi.string()
};

const itemRouter = new ItemRouter<Venue>(
    controller,
    requiredFields,
    optionalFields
);

export default itemRouter.router;