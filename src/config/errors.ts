import { Response } from "express";

type ErrorName =
    | 'DB_QUERY_ERROR'
    | 'BCRYPT_ERROR'
    | 'BAD_AUTH_ERROR'
    | 'UNKNOWN_ERROR';

export class FruitflyError extends Error {
    name: ErrorName;
    message: string;
    cause: any;
    
    constructor({name, message, cause}: {name: ErrorName, message: string, cause?: any}) {
        super();

        this.name = name;
        this.message = message;
        this.cause = cause;
    }
}

export const sendError = (res: Response, err: any = null, status: number = 500, message: string = 'Unknown error') => {
    res.status(status).json({
        name: err instanceof Error ? err.name : 'ERROR',
        message: err instanceof Error ? err.message : message
    });
}