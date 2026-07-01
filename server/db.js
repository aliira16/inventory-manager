import PG from "pg";

const {Pool} = PG;

const pool = new Pool({
    user: process.env.DBuser,
    password: process.env.DBpassword,
    host: process.env.DBhost,
    port: process.env.DBport,
    database: process.env.DBdatabase
});

export default pool;