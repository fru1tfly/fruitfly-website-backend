import jwt, { JwtPayload } from "jsonwebtoken";
import { FruitflyError } from "../config/errors";

export type PartialWithValue<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export const sanitize = <T extends Object>(obj: T) => {

    let result: {[key: string]: any} = {};

    for(const [key, value] of Object.entries(obj)) {
        if(value !== null && key !== 'id') {
            if(typeof value === "string") {
                if (value === '') {
                    result[key] = null;
                } else {
                    result[key] = value.replace(/['"]/g, '\\$&');
                }
            } else {
                result[key] = value;
            }
        } 
    }

    return result;
}

export const validateSession = (token: string): JwtPayload | string => {
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        return decodedToken;
    } catch (err) {
        throw new FruitflyError({
            name: 'BAD_AUTH_ERROR',
            message: `Session expired or invalid, please log in again${err instanceof Error ? `: ${err.message}` : ''}`,
            status: 400
        });
    }
}

export const normalizeDate = (date: string) => {
    console.log(date);
    const normalizedDate = new Date(date);
    normalizedDate.setMinutes(normalizedDate.getMinutes() + normalizedDate.getTimezoneOffset());
    return normalizedDate.toISOString().split('T')[0];
}