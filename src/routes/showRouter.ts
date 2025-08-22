import { ShowController } from '../controllers/showController';
import { Show, ShowDTO } from '../models/Show';
import { ItemRouter } from './itemRouter';

const controller = new ShowController();
const itemRouter = new ItemRouter<Show, ShowDTO>(controller);
const router = itemRouter.router;

router.get(
    ['/upcoming', '/upcoming/:showCount'],
    controller.getUpcomingShows
);

export default router;