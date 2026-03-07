import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

});

pool.connect()
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.error("DB Error:", err.message));

