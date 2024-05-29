import dotenv from 'dotenv';
import {app} from './app';

// define  environment variables
dotenv.config();
const PORT = process.env.PORT ?? 3001;

// start server
const start = async () => {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
};

start();
