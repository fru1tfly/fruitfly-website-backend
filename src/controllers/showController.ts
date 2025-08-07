import { Request, Response } from 'express';
import { ShowService } from '../services/showService';
import { getSession } from '../utils';

const showService = new ShowService();

export const getUpcomingShows = async (req: Request, res: Response) => {
    try {
        let shows;
        if (req.params.showCount) {
            shows = await showService.getUpcomingShows(parseInt(req.params.showCount));
        } else {
            shows = await showService.getUpcomingShows();
        }

        res.status(200).json({
            count: shows.length, 
            shows: shows 
        });

    } catch (err) {
        res.status(500).json({
            name: err instanceof Error ? err.name : 'ERROR',
            message: err instanceof Error ? err.message : 'Unknown error'
        });
    }
}

export const createShow = async (req: Request, res: Response) => {
    try {
        const session = getSession(req.headers.token as string);
        
    } catch (err) {
        res.status(401).json({
            name: err instanceof Error ? err.name : 'ERROR',
            message: err instanceof Error ? err.message : 'Unknown error'
        });
    }
}