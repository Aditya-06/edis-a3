import {Request, Response, NextFunction} from 'express';

// Route requests based on the X-Client-Type header
const logger = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

export default logger;
