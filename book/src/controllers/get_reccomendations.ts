import {Request, Response, Router} from 'express';
import circuitBreaker from '../middleware/circuit-breaker';

const router = Router();

const retrieveBook = async (req: Request, res: Response): Promise<Response> => {
  const {ISBN} = req.params;
  if (!ISBN) {
    return res.status(404).json({message: 'No ISBN given'});
  }

  try {
    const recommendations = await circuitBreaker.fire(ISBN);
    if (recommendations.length) {
      return res.status(200).json(recommendations);
    } else {
      return res.status(204).send(); // No recommendations found
    }
  } catch (error: any) {
    // first check the state of the circuit brekaer
    if (circuitBreaker.opened) {
      console.log('Failed cause circuit breaker open');
      return res.status(503).send('Circuit breaker open');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('Failed cause timeout');
      return res.status(504).send('Recommendation service timed out');
    } else {
      console.error('Unexpected error:', error);
      return res.status(500).send('Internal server error');
    }
  }
};

router.get('/books/:ISBN/related-books/', retrieveBook);

export default router;
