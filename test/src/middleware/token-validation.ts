import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({error: 'Missing JWT token'});
  }

  try {
    const decoded = jwt.decode(token) as {[key: string]: any};

    // Validate token conditions
    const validSubjects = ['starlord', 'gamora', 'drax', 'rocket', 'groot'];
    const validIssuer = 'cmu.edu';

    if (!decoded.sub || !validSubjects.includes(decoded.sub)) {
      return res.status(401).json({error: 'Invalid subject in JWT token'});
    }

    if (!decoded.exp || decoded.exp < Date.now() / 1000) {
      return res.status(401).json({error: 'JWT token has expired'});
    }

    if (!decoded.iss || decoded.iss !== validIssuer) {
      return res.status(401).json({error: 'Invalid issuer in JWT token'});
    }

    // Token is valid, proceed
    return next();
  } catch (error) {
    return res.status(401).json({error: 'Invalid JWT token'});
  }
};

export default validateToken;
