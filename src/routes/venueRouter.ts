import { ItemRouter } from './itemRouter';
import { Venue } from '../models/Venue';
import { VenueController } from '../controllers/venueController';

const controller = new VenueController();
const itemRouter = new ItemRouter<Venue>(controller);

export default itemRouter.router;