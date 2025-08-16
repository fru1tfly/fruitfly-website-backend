import { Show, ShowDTO } from "../models/Show";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { FruitflyError } from "../config/errors";
import { sanitize, PartialWithValue, normalizeDate } from "../utils";

export class ShowService {

    public async getAllShows(): Promise<Show[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(this.queryBase);
            return rows.map(this.buildShow);
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving all shows`,
                status: 500
            })
        }
    }

    public async getShowById(id: number): Promise<Show | null> {
        const query = `
            ${this.queryBase}
            WHERE Shows.id = ${id}
        `;

        try {
            const [rows] = await db.query<RowDataPacket[]>(query);
            return rows.length ? this.buildShow(rows[0]) : null;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving show with id '${id}'`,
                status: 500
            });
        }
    }

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
            return rows.map(this.buildShow);
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving upcoming shows`,
                status: 500
            });
        }
    }

    public async createShow(showData: Partial<ShowDTO>): Promise<number> {
        try {
            const sanitizedShowData = sanitize(showData);
            const showKeys = Object.keys(sanitizedShowData).join();

            const [result] = await db.query<ResultSetHeader>(
                `INSERT INTO Shows (${showKeys}) VALUES (${[...Array(Object.keys(sanitizedShowData).length)].map(() => '?').join()})`,
                Object.values(sanitizedShowData)
            );

            return result.insertId;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while creating a new show`,
                status: 500
            });
        }
    }

    public async updateShow(showData: PartialWithValue<ShowDTO, 'id'>): Promise<number> {
        try {
            const showId = showData.id;
            const sanitizedShowData = sanitize(showData);
            const query = `
                UPDATE Shows 
                SET ${Object.entries(sanitizedShowData).map(([key, value]) => {
                    if (typeof value === "string")
                        return `${key} = '${value.replace(/[']/g, '\\$&')}'`
                    else
                        return `${key} = ${value}`
                })} 
                WHERE id = ${showData.id}
            `;

            console.log(query);

            await db.query<ResultSetHeader>(query);

            return showId;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while updating show with id '${showData.id}'`,
                status: 500
            }); 
        }
    }

    public async deleteShow(showId: number) {
        try {
            await db.query<ResultSetHeader>(`DELETE FROM Shows WHERE id = ${showId}`);
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while deleting show with id '${showId}'`,
                status: 500
            }); 
        }
    }

    private queryBase:string = `
        SELECT 
            Shows.*,
            Venues.venueName,
            Venues.address,
            Venues.defaultImgUrl,
            Venues.city,
            Venues.ageRestriction
        FROM
            Shows
        INNER JOIN
            Venues
        ON
            Shows.venue_id = Venues.id
    `;

    private buildShow(row: RowDataPacket): Show {
        
        return {
            id: row.id,
            venue_id: row.venue_id,

            showName: row.showName,
            venueName: row.venueName,

            date: normalizeDate(row.date),
            imgUrl: row.imgUrl,
            otherActs: row.otherActs ? row.otherActs.split(';') : '',

            defaultImgUrl: row.defaultImgUrl,
            address: row.address,
            city: row.city,
            ageRestriction: row.ageRestriction,

            doorsTime: row.doorsTime,
            showTime: row.showTime,
            setTime: row.setTime,
            
            ticketUrl: row.ticketUrl,
            price: row.price
        };
    }
}