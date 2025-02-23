import * as fs from 'fs';
import * as users from "./schema/users";
import * as photos from "./schema/photos";
import * as posts from "./schema/posts";

import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres"; 

const schema = {
  ...users,
  ...photos,
  ...posts,
};

// Create a pg client instance with SSL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,  // Enforce SSL verification
    ca: fs.readFileSync('./certs/server.crt').toString(),  // Explicitly set the CA
  },
});

// Connect to PostgreSQL
client.connect().catch((err) => {
  console.error("Failed to connect to PostgreSQL:", err);
});

// Pass the client to Drizzle
export const db = drizzle(client, { schema });
