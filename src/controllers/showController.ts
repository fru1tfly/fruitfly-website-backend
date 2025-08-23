import { Request, Response } from 'express';
import { ShowService } from '../services/showService';
import { ItemController } from './itemController';
import { Show, ShowDTO } from '../models/Show';
import { sendError, defaultError } from '../config/errors';

export class ShowController extends ItemController<Show, ShowDTO> {
    protected readonly service = new ShowService();
    protected readonly filterKeys: (keyof Show)[] = [
        "city",
        "otherActs",
        "showName",
        "venueName"
    ];

    constructor() {
        super();
        this.getAll = this.getAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getUpcomingShows = this.getUpcomingShows.bind(this);
    }

    public async getUpcomingShows(req: Request, res: Response) {
        try {
            let shows;
            if (req.params.showCount) {
                shows = await this.service.getUpcomingShows(parseInt(req.params.showCount));
            } else {
                shows = await this.service.getUpcomingShows();
            }
            res.status(200).json({
                count: shows.length, 
                shows: shows 
            });
        } catch (err) {
            sendError(res, err instanceof Error ? err : defaultError);
        }
    }
}
