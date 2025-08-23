import { Request, Response } from "express";
import { ItemService } from "../services/itemService";
import { DatabaseItem } from "../models/DatabaseItem";
import { defaultError, sendError } from "../config/errors";
import { ItemDisplay } from "../models/ItemDisplay";
import { validateSession } from "../utils";

export abstract class ItemController<T extends DatabaseItem, DTO extends DatabaseItem = never> {
    protected abstract readonly service: ItemService<T, DTO>;
    protected abstract readonly filterKeys: (keyof T)[];

    public async getAll(req: Request, res: Response): Promise<void> {
        const params = req.query;
        const display = ItemDisplay.extractFromUrlQuery(params);
        const filters = this.extractFromUrlQuery(params);
        display.filters = {...filters};

        try {
            validateSession(req.headers.token as string);

            const result: T[] = await this.service.getAll(display);
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
            console.log(req.params.id);
            
            await this.service.delete(parseInt(req.params.id));
            res.status(200).json({ message: 'deleted successfully' });
        } catch (err) {
            sendError(res, err instanceof Error ? err : defaultError);
        }
    }

    protected extractFromUrlQuery = <T extends object>(query: Record<string, unknown>): T => {
        const result: Partial<T> = {};
        for (const key of this.filterKeys) {
            const value = query[key as string];
            if (typeof value === "string") {
                result[key as keyof T] = value as any;
            }
        }
        return result as T;
    }
}
