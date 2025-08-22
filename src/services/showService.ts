import { Show, ShowDTO } from "../models/Show";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { FruitflyError } from "../config/errors";
import { sanitize, PartialWithValue, normalizeDate } from "../utils";
import { ItemService } from "./itemService";

export class ShowService extends ItemService<Show, ShowDTO> {

    constructor() {
        const queryBase: string = `
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

        const itemFactory = (row: RowDataPacket): Show => {
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

        super(
            'Shows',
            'show',
            queryBase,
            itemFactory
        );
    }

    public async getUpcomingShows(showCount:number = 10): Promise<Show[]> {
        const query = `
            ${this.queryBase}
            WHERE
                Shows.date >= CURRENT_DATE
            ORDER BY Shows.date ASC
            LIMIT ${showCount}
        `;

        try {
            const [rows] = await db.query<RowDataPacket[]>(query);
            return rows.map(this.itemFactory);
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving upcoming shows`,
                status: 500
            });
        }
    }
}