import {Dialect, Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName: string = process.env.DATABASE_NAME ?? '';
const dbUser: string = process.env.DATABASE_USER ?? '';
const dbHost: string = process.env.DATABASE_HOST ?? '';
const dbDriver: Dialect = 'mysql' as Dialect;
const dbPassword: string = process.env.DATABASE_PASSWORD ?? '';

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  define: {timestamps: false},
  logging: false,
});

export default sequelizeConnection;
