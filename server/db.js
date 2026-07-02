import PG from "pg";
import dotenv from "dotenv"

const {Pool} = PG;
dotenv.config()

const pool = new Pool({
    user: process.env.DBuser,
    password: process.env.DBpassword,
    host: process.env.DBhost,
    port: process.env.DBport,
    database: process.env.DBdatabase
});

export default pool;