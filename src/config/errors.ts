import { Response } from "express";

type ErrorName =
    | 'DB_QUERY_ERROR'
    | 'BCRYPT_ERROR'
    | 'BAD_AUTH_ERROR'
    | 'UNKNOWN_ERROR';

export class FruitflyError extends Error {
    name: ErrorName;
    message: string;
    status: number;
    
    constructor({name, message, status}: {name: ErrorName, message: string, status: number}) {
        super();

        this.name = name;
        this.message = message;
        this.status = status;
    }
}

const defaultErrorStatus = 500;
export const defaultError = new FruitflyError({
    name: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    status: defaultErrorStatus
});

export const sendError = (res: Response, err: Error) => {
    res.status(err instanceof FruitflyError ? err.status : defaultErrorStatus).json(err);
}