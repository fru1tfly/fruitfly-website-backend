import jwt, { JwtPayload } from "jsonwebtoken";
import { FruitflyError } from "../config/errors";

export const sanitize = <T extends Object>(obj: T) => {

    let result: {[key: string]: any} = {};

    for(const [key, value] of Object.entries(obj)) {
        if(value !== null) {
            result[key] = value;
        } 
    }

    return result;
}

export const getSession = (token: string): JwtPayload | string => {
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        return decodedToken;
    } catch (err) {
        throw new FruitflyError({
            name: 'BAD_AUTH_ERROR',
            message: 'Invalid auth token',
            cause: err
        });
    }
}