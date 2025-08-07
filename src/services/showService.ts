import { Show, ShowDTO } from "../models/Show";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { FruitflyError } from "../config/errors";
import { sanitize } from "../utils";

export class ShowService {
    private queryBase = `
        SELECT 
            Shows.*,
            Venues.*
        FROM
            Shows
        INNER JOIN
            Venues
        ON
            Shows.venue_id = Venues.id
    `;

    public async getUpcomingShows(showCount:number = 10): Promise<Show[]> {
        const query = `
            ${this.queryBase}
            WHERE
                Shows.date > CURRENT_DATE
            ORDER BY Shows.date ASC
            LIMIT ${showCount}
        `;

        try {
            const [rows] = await db.query<RowDataPacket[]>(query);
            return rows.map(row => ({
                id: row.id,

                showName: row.showName,
                venueName: row.venueName,

                date: row.date,
                imgUrl: row.imgUrl,
                otherActs: row.otherActs.split(';'),

                address: row.address,
                city: row.city,
                ageRestriction: row.ageRestriction,

                doorsTime: row.doorsTime,
                showTime: row.showTime,
                setTime: row.setTime,
                
                ticketUrl: row.ticketUrl,
                price: row.price
            }));
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving upcoming shows`,
                cause: err
            });
        }
    }

    public async createShow(showData: Partial<ShowDTO>): Promise<number> {
        try {
            const sanitizedShowData = sanitize(showData);
            const showKeys = Object.keys(sanitizedShowData).join();

            const [result] = await db.query<ResultSetHeader>(
                `INSERT INTO Shows (${showKeys}) VALUES (${[...Array(showKeys.length)].map(() => '?').join()})`,
                Object.values(sanitizedShowData)
            );

            return result.insertId;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while creating a new show`,
                cause: err
            });
        }
    }
}