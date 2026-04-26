import pkg from 'pg';
import fs from 'fs';
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  // optional:
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CERT,
  },

});

pool.on('connect', () => {
  console.log(' PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error(' Unexpected DB error', err);
  process.exit(1);
});