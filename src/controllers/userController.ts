import { Request, Response } from 'express';
import session from "express-session";

import { User } from '../models/User';
import { UserService } from '../services/userService';
import { getHashedPassword, comparePassword } from '../config/bcrypt';
import { defaultError, FruitflyError, sendError } from '../config/errors';

declare module 'express-session' {
    interface SessionData {
        loggedIn: Boolean;
        username: string;
    }
}

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const existingUser = await userService.getUserByUsername(username);
        if (!existingUser) {
            const hashedPassword = await getHashedPassword(password);

            let newUser:Omit<User, 'id'> = {
                ...req.body,
                password: hashedPassword
            };

            await userService.addNewUser(newUser);
        } else {
            throw new FruitflyError({
                name: 'BAD_AUTH_ERROR',
                message: `Another user with the username '${username}' already exists.`,
                status: 400
            });
        }

    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const badAuthError = new FruitflyError({
        name: 'BAD_AUTH_ERROR',
        message: 'Incorrect username or password',
        status: 400
    });

    try {
        const { username, password } = req.body;

        const givenUser = await userService.getUserByUsername(username);
        if (givenUser) {
            const isCorrectPassword = await comparePassword(password, givenUser.password);
            if (isCorrectPassword) {
                const token = userService.generateToken(givenUser);
                Reflect.deleteProperty(givenUser, 'password');

                res.status(200).json({ 
                    message: 'Login successful',
                    token: token
                });
            } else {
                throw badAuthError;
            }
        } else {
            throw badAuthError;
        }

    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        sendError(res, err instanceof Error ? err : defaultError);
    }
}
