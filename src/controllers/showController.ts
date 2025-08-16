import { Request, Response } from 'express';
import { ShowService } from '../services/showService';
import { validateSession } from '../utils';
import { sendError, defaultError } from '../config/errors';

const showService = new ShowService();

export const getAllShows = async (req: Request, res: Response) => {
    try {
        const shows = await showService.getAllShows();
        res.status(200).json(shows);
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const getShowById = async (req: Request, res: Response) => {
    try {
        const show = await showService.getShowById(req.body.id);
        res.status(200).json({ show: show });
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

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
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const createShow = async (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);
        
        const newShowId = await showService.createShow(req.body);
        const newShowDetails = await showService.getShowById(newShowId); 
        res.status(200).json({ id: newShowId, item: newShowDetails });
        
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const updateShow = async (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);

        console.log(req.body);
        
        const updatedShowId = await showService.updateShow(req.body);
        const updatedShowDetails = await showService.getShowById(updatedShowId); 
        res.status(200).json({ id: updatedShowId, item: updatedShowDetails });
        
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const deleteShow = async (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);
        
        await showService.deleteShow(parseInt(req.params.id));
        res.status(200).json({ message: 'Show deleted successfully' });
        
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}