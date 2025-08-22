import { Request, Response } from "express";
import { ItemService } from "../services/itemService";
import { DatabaseItem } from "../models/DatabaseItem";
import { defaultError, sendError } from "../config/errors";
import { ItemDisplay } from "../models/ItemDisplay";
import { extractFromUrlQuery, validateSession } from "../utils";

export abstract class ItemController<T extends DatabaseItem, DTO extends DatabaseItem = never> {
    abstract service: ItemService<T, DTO>;

    public async getAll(req: Request, res: Response): Promise<void> {
        const params = req.query;
        const display = extractFromUrlQuery<ItemDisplay>(params);
        const filters = extractFromUrlQuery<T>(params);
        display.filters = {...filters};
        console.log(display);

        try {
            validateSession(req.headers.token as string);

            const result: T[] = await this.service.getAll({});
            res.status(200).json(result);
        } catch (err) {
            sendError(res, err instanceof Error ? err : defaultError);
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            validateSession(req.headers.token as string);

            const newItemId = await this.service.create(req.body);
            const newItemDetails = await this.service.getById(newItemId);
            res.status(200).json({ id: newItemId, item: newItemDetails });
        } catch (err) {
            sendError(res, err instanceof Error ? err : defaultError);
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            validateSession(req.headers.token as string);
    
            const newItemId = await this.service.update(req.body);
            const newItemDetails = await this.service.getById(newItemId); 
            res.status(200).json({ id: newItemId, item: newItemDetails });
            
        } catch (err) {
            sendError(res, err instanceof Error ? err : defaultError);
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            validateSession(req.headers.token as string);
            
            await this.service.delete(parseInt(req.params.id));
            res.status(200);
        } catch (err) {
            sendError(res, err instanceof Error ? err : defaultError);
        }
    }
}
