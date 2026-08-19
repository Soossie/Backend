import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;

export const db = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password
});
