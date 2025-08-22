import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitize, PartialWithValue } from "../utils";
import { db } from "../config/database";
import { FruitflyError } from "../config/errors";
import { DatabaseItem } from "../models/DatabaseItem";
import { ItemDisplay } from "../models/ItemDisplay";

export class ItemService<T extends DatabaseItem, DTO extends DatabaseItem = never> {

    tableName: string;
    itemName: string;
    queryBase: string;
    itemFactory: (item: RowDataPacket) => T;

    constructor(
        tableName: string, 
        itemName: string,
        queryBase: string = '', 
        itemFactory: (item: RowDataPacket) => T = (item) => item as T
    ) {
        this.tableName = tableName;
        this.itemName = itemName;
        if (queryBase) {
            this.queryBase = queryBase;
        } else {
            this.queryBase = `SELECT * FROM ${tableName}`;
        }
        this.itemFactory = itemFactory;
    }

    /**
     * @description Get records for an item with provided criteria, or all records if no criteria are provided
     * @param display Filters and pagination values to narrow the query results
     * @returns The list of records retrieved from the database
     */
    public async getAll(display: ItemDisplay): Promise<T[]> {
        try {
            console.log('asdfasdf');
            let queryCondition = '';
            if (display.filters) {
                const filterKeys = Object.keys(display.filters);
                if (filterKeys.length > 0) {
                    queryCondition += `WHERE `;
                    for(const key of filterKeys) {
                        queryCondition += `AND ${key} LIKE '%${display.filters[key]}%'`
                    }
                }
            }

            if (display.sortColumn) queryCondition +=  `ORDER BY ${display.sortColumn} ${display.sortDirection}`;
            if (display.pageSize) queryCondition += `LIMIT ${display.pageSize} `;
            if (display.pageNumber) queryCondition += `OFFSET ${display.pageNumber}`;

            console.log(queryCondition);
            
            const [rows] = await db.query<(RowDataPacket & T)[]>(`${this.queryBase} ${queryCondition}`);
            return rows.map(this.itemFactory);
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving all ${this.itemName} records`,
                status: 500
            })
        }
    }

    /**
     * @description Retrieves a single record by its id value
     * @param id The id to compare against
     * @returns The given record, or null if no record was found
     */
    public async getById(id: number): Promise<T | null> {
        try {
            const [rows] = await db.query<(RowDataPacket & T)[]>(`
                ${this.queryBase} 
                WHERE id = ${id}
            `);

            return rows.length ? rows[0] : null;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while retrieving ${this.itemName} with id '${id}'`,
                status: 500
            })
        }
    }

    /** 
     * @description Create a new item in the database
     * @param data The data to insert into the new record
     * @returns The ID of the newly created row in the database
    */
    public async create(data: T | DTO): Promise<number> {
        const sanitizedVenueData = sanitize(data);
        const itemKeys = Object.keys(sanitizedVenueData).join();

        try {
            const [result] = await db.query<ResultSetHeader>(
                `INSERT INTO ${this.tableName} (${itemKeys}) 
                VALUES (${[...Array(Object.keys(sanitizedVenueData).length)].map(() => '?').join()})`,
                Object.values(sanitizedVenueData)
            );

            return result.insertId;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while attempting to create new ${this.itemName}`,
                status: 500
            });
        }
    }

    /**
     * @description Update an existing item in the database
     * @param update The data to update (must include record ID)
     * @returns The ID of the updated row in the database
     */
    public async update(update: PartialWithValue<T | DTO, 'id'>): Promise<number> {
        try {
            const itemId = update.id;
            const sanitizedVenueData = sanitize(update);
            const query = `
                UPDATE ${this.tableName} 
                SET ${Object.entries(sanitizedVenueData).map(([key, value]) => {
                    if (typeof value === "string")
                        return `${key} = '${value.replace(/[']/g, '\\$&')}'`
                    else
                        return `${key} = ${value}`
                })} 
                WHERE id = ${itemId}
            `;

            await db.query<ResultSetHeader>(query);
            return itemId;
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while updating ${this.itemName} with id '${update.id}'`,
                status: 500
            }); 
        }
    }
    
    /**
     * @description Delete a record in the database
     * @param id The ID of the record to delete
     */
    public async delete(id: number): Promise<void> {
        try {
            await db.query<ResultSetHeader>(`DELETE FROM ${this.tableName} WHERE id = ${id}`);
        } catch (err) {
            throw new FruitflyError({
                name: 'DB_QUERY_ERROR',
                message: err instanceof Error ? err.message : `An error occurred while deleting ${this.itemName} with id '${id}'`,
                status: 500
            }); 
        }
    }
}