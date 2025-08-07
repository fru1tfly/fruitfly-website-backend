import { createPool, Pool } from 'mysql2/promise';


export const db: Pool = createPool({
    host: process.env.HOST_IP,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME
});