import { Request, Response } from "express";
import { sendError, defaultError } from "../config/errors";
import { validateSession } from "../utils";
import path from "path";
import fs from 'node:fs';

export const uploadFile = (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);

        const destination = decodeURIComponent(req.params.fileDestination);
        const newFileUrl = path.join(destination, req.file?.filename as string);

        res.status(200).json({ file: newFileUrl });
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const deleteFile = (req: Request, res: Response) => {
    try {
        validateSession(req.headers.token as string);

        const location = decodeURIComponent(req.params.location);
        fs.rmSync(path.join(process.env.PUBLIC_FOLDER as string, location));

        res.status(200).json({ success: true });
    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}