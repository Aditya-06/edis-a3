import express, {Request, Response, Express} from 'express';
import morgan from 'morgan';
import validateToken from './middleware/token-validation';
import logger from './middleware/logger';
import bookCaller from './apis/book-caller';
import customerCaller from './apis/customer-caller';

const app: Express = express();

// define parsing params
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// call the middleware functions
app.use(morgan('tiny'));
app.use(logger);
app.use(validateToken);

// disabling cache for dev purposes -> Sequlize updates not reflected
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  next();
});

app.use('/books/', bookCaller);
app.use('/customers/', customerCaller);

// API logger

// base route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({message: 'mobile bff'});
});

export {app};
