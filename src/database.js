import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;

export const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    port: parseInt(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
 })

client.connect();

export default client;