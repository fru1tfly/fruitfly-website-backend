import { User } from "../models/User";
import { db } from "../config/database";
import { FruitflyError } from "../config/errors";

import jwt from 'jsonwebtoken';
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

interface UserRow extends RowDataPacket, User {}

export class UserService {
    public async getUserByUsername(username: string): Promise<User | null> {
        try {
            const [rows] = await db.query<UserRow[]>(
                'SELECT * FROM Users WHERE username = ?',
                [username]
            );

            return rows.length ? rows[0] : null;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving user '${username}'`,
                status: 500
            });
        }
    }

    public async addNewUser(userInfo: Omit<User, 'id'>) {
        try {
            await db.query<ResultSetHeader>(
                'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
                [userInfo.username, userInfo.email, userInfo.password]
            );
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while attempting to create a new user`,
                status: 500
            });
        }
    }

    public generateToken(user: User): string {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(process.env.LOGIN_EXP_DAYS as string));

        return jwt.sign(
            {
                id: user.id,
                username: user.username,
                exp: expirationDate.getTime() / 1000
            },
            process.env.JWT_SECRET as string
        )
    }
}