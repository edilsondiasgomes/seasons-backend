import pkg from 'pg';
const { Client } = pkg;

export const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "seasons"
})

client.connect();

export default client;