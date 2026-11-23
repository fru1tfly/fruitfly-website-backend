import { ShowController } from '../controllers/showController';
import { Show, ShowDTO } from '../models/Show';
import { ItemRouter } from './itemRouter';
import { Joi } from 'celebrate';

const controller = new ShowController();

const requiredFields = {
    venue_id: Joi.number(),
    date: Joi.string()
};

const optionalFields = {
    showName: Joi.string(),
    imgUrl: Joi.string().uri({ allowRelative: true }),
    otherActs: Joi.string().allow(''),
    doorsTime: Joi.string(),
    showTime: Joi.string(),
    setTime: Joi.string(),
    ticketUrl: Joi.string(),
    price: Joi.string()
};

const itemRouter = new ItemRouter<Show, ShowDTO>(
    controller, 
    requiredFields, 
    optionalFields
);


itemRouter.router.get(
    ['/upcoming', '/upcoming/:showCount'],
    controller.getUpcomingShows
);

export default itemRouter.router;