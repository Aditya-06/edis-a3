import express, {Request, Response, Express, NextFunction} from 'express';
import morgan from 'morgan';

import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';

const app: Express = express();

// define parsing params
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Route requests based on the X-Client-Type header
const alb = async (req: Request, res: Response, next: NextFunction) => {};

// disabling cache for dev purposes -> Sequlize updates not reflected
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  next();
});

// API logger
app.use(morgan('tiny'));

// base route
app.get('/*', async (req: Request, res: Response) => {
  console.log('Test alb called');
  const clientType = req.headers['X-Client-Type'] as string;
  if (!clientType) {
    return res.status(400).json({error: 'Missing X-Client-Type header'});
  }
  let config: AxiosRequestConfig;
  console.log(clientType);
  switch (clientType.toLowerCase()) {
    case 'web':
      config = {
        method: req.method,
        url: `http://localhost:3001${req.originalUrl}`,
        headers: req.headers,
        data: req.body,
      };
      console.log(config.url);
      try {
        const response: AxiosResponse = await axios(config);
        console.log(response.data);
        const status = response.status;

        return res.status(status).send(response.data);
      } catch (e: any) {
        if (e.response) {
          const errorStatus = e.response.status;
          if (errorStatus >= 400 && errorStatus < 500)
            return res.status(e.response.status).json(e.response.data);
          return res.status(500).json({message: 'Server error :('});
        }
        return res.status(500).json({message: 'Server error :('});
      }
    case 'ios':
    case 'android':
      config = {
        method: req.method,
        url: `http://localhost:3000${req.originalUrl}`,
        headers: req.headers,
        data: req.body,
      };
      console.log(config.url);

      try {
        const response: AxiosResponse = await axios(config);
        console.log(response.data);
        const status = response.status;

        return res.status(status).send(response.data);
      } catch (e: any) {
        if (e.response) {
          const errorStatus = e.response.status;
          if (errorStatus >= 400 && errorStatus < 500)
            return res.status(e.response.status).json(e.response.data);
          return res.status(500).json({message: 'Server error :('});
        }
        return res.status(500).json({message: 'Server error :('});
      }
    default:
      console.log('no client type provided');
      return res
        .status(400)
        .json({error: 'Invalid X-Client-Type header value'});
  }
});

export {app};
