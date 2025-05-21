
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.TYPEORM_TYPE as 'mysql', // Ensure type is cast correctly
  host: process.env.TYPEORM_HOST,           // MySQL host from .env
  port: parseInt(process.env.TYPEORM_PORT || '3306', 10), // Parse port as a number
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.DATABASE,           // Database name from .env
  synchronize: false,                        // Auto creates DB schema (disable in production)
  logging: ["query", "error"],
  entities: [__dirname + '/../entities/*.js'], // For compiled files in the dist folder migrations: [],
  migrations: [], // For compiled files in the dist folder
  subscribers: []
});
