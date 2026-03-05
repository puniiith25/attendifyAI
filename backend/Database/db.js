import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.error("DB Error:", err.message));