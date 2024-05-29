import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';

// Import the routes
import customerRouter from './controllers/add_customer';
import retreiveIdCustomerRouter from './controllers/get_customer';
import retreiveUserCustomerRouter from './controllers/get_customer_userid';

const app: Express = express();

// define parsing params
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// disabling cache for dev purposes -> Sequlize updates not reflected
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  next();
});

// API logger
app.use(morgan('tiny'));

// routes we have implemented
app.use(customerRouter);
app.use(retreiveIdCustomerRouter);
app.use(retreiveUserCustomerRouter);

// base route
app.get('/', (req: Request, res: Response) => {
  res.send('API: A1');
});

export {app};
