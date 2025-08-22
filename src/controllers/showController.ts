import { Request, Response } from 'express';
import { ShowService } from '../services/showService';
import { sendError, defaultError } from '../config/errors';
import { ItemController } from './itemController';
import { Show, ShowDTO } from '../models/Show';

export class ShowController extends ItemController<Show, ShowDTO> {
    service = new ShowService();

    constructor() {
        super();
        this.getAll = this.getAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
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
