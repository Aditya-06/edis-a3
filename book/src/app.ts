import express, {Express, Request, Response} from 'express';
import morgan from 'morgan';

// Import the routes
import bookRouter from './controllers/add_book';
import updateBookRouter from './controllers/update_book';
import retreiveBookRouter from './controllers/retreive_book';
import getRelatedBooksRouter from './controllers/related-books';
import getReccBooksRouter from './controllers/get_reccomendations';

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
app.use(bookRouter);
app.use(updateBookRouter);
app.use(retreiveBookRouter);
app.use(getRelatedBooksRouter);
app.use(getReccBooksRouter);

// base route
app.get('/', (req: Request, res: Response) => {
  res.send('API: A1');
});

export {app};
