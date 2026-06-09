import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // carrega o .env

console.log({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['src/**/entities/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['src/**/entities/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});