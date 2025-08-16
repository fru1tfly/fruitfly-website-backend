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
        
        const newVenueId = await venueService.createVenue(req.body);
        const newVenueDetails = await venueService.getVenueById(newVenueId); 
        res.status(200).json({ id: newVenueId, item: newVenueDetails });
        
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const updateVenue = async (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);

        const updatedVenueId = await venueService.updateVenue(req.body);
        const updatedVenueDetails = await venueService.getVenueById(updatedVenueId); 
        res.status(200).json({ id: updatedVenueId, item: updatedVenueDetails });
        
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