import { RowDataPacket } from "mysql2";
import { db } from "../config/database";
import { Venue } from "../models/Venue";
import { FruitflyError } from "../config/errors";
import { sanitize, PartialWithValue } from "../utils";
import { ResultSetHeader } from "mysql2";

interface VenueRow extends RowDataPacket, Venue {}

export class VenueService {

    public async getAllVenues(): Promise<Venue[]> {
        try {
            const [rows] = await db.query<VenueRow[]>(`SELECT * FROM Venues ORDER BY venueName ASC`);
            return rows;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving all venues`,
                status: 500
            });
        }
    }

    public async getVenueById(id: number): Promise<Venue | null> {
        const query = `
            SELECT * FROM Venues
            WHERE Venues.id = ${id}
        `;

        try {
            const [rows] = await db.query<VenueRow[]>(query);
            return rows.length ? rows[0] : null;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving show with id '${id}'`,
                status: 500
            });
        }
    }

    public async getFromSearchTerm(searchTerm: string): Promise<Venue[]> {
        try {
            const [rows] = await db.query<VenueRow[]>(`
                SELECT * 
                FROM Venues 
                WHERE venueName LIKE '%${searchTerm}%'
                ORDER BY venueName ASC
            `);
            return rows;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving all venues`,
                status: 500
            });
        }
    }

    public async createVenue(venueData: Partial<Venue>): Promise<number> {
        try {
            const sanitizedVenueData = sanitize(venueData);
            const venueKeys = Object.keys(sanitizedVenueData).join();

            const [result] = await db.query<ResultSetHeader>(
                `INSERT INTO Venues (${venueKeys}) VALUES (${[...Array(Object.keys(sanitizedVenueData).length)].map(() => '?').join()})`,
                Object.values(sanitizedVenueData)
            );

            return result.insertId;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while creating a new venue`,
                status: 500
            });
        }
    }

    public async updateVenue(venueData: PartialWithValue<Venue, 'id'>): Promise<number> {
        try {
            const venueId = venueData.id;
            const sanitizedVenueData = sanitize(venueData);
            const query = `
                UPDATE Venues 
                SET ${Object.entries(sanitizedVenueData).map(([key, value]) => {

                    if (typeof value === "string")
                        return `${key} = '${value.replace(/[']/g, '\\$&')}'`
                    else
                        return `${key} = ${value}`
                })} 
                WHERE id = ${venueId}
            `;

            await db.query<ResultSetHeader>(query);

            return venueId;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while updating show with id '${venueData.id}'`,
                status: 500
            }); 
        }
    }

    public async deleteVenue(venueId: number) {
        try {
            await db.query<ResultSetHeader>(`DELETE FROM Venues WHERE id = ${venueId}`);
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while deleting venue with id '${venueId}'`,
                status: 500
            }); 
        }
    }

}