import { Request, Response } from "express";
import { sendError, defaultError } from "../config/errors";
import { VenueService } from "../services/venueService";
import { validateSession } from '../utils';

const venueService = new VenueService();

export const getAllVenues = async (req: Request, res: Response) => {
    try {
        const venues = await venueService.getAllVenues();
        res.status(200).json(venues);
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const getFromSearchTerm = async (req: Request, res: Response) => {
    try {
        const searchTerm = req.params.searchTerm;

        if(searchTerm) {
            const venues = await venueService.getFromSearchTerm(searchTerm);
            res.status(200).json(venues);
        } else {
            getAllVenues(req, res);
        }
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const createVenue = async (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);
        
        const newShowId = await venueService.createVenue(req.body);
        const newShowDetails = await venueService.getVenueById(newShowId); 
        res.status(200).json({ newShowId: newShowId, show: newShowDetails });
        
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const updateVenue = async (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);

        const updatedShowId = await venueService.updateVenue(req.body);
        const updatedShowDetails = await venueService.getVenueById(updatedShowId); 
        res.status(200).json({ updatedShowId: updatedShowId, show: updatedShowDetails });
        
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const deleteVenue = async (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);
        
        await venueService.deleteVenue(parseInt(req.params.id));
        res.status(200).json({ message: 'Show deleted successfully' });
        
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}