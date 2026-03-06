import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
    connectionString: 'ostgresql://postgres.toipguxmufufcqlrfdcr:fyhte1-saZsis-warcut@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',

});

pool.connect()
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.error("DB Error:", err.message));