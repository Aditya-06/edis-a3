import {Request, Response, Router} from 'express';

import customer from '../models/customer';
import {query, validationResult} from 'express-validator';

const router = Router();

router.get(
  '/customers',
  [query('userId').isEmail().withMessage('Enter a valid Email')],
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    // check for query strings
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {userId} = req.query;

    if (!userId) {
      return res.status(400).json({message: 'userId missing'});
    }

    try {
      // decode the URI
      // will convert %40 -> @
      const decodedUserId = decodeURIComponent(String(userId)); // Decode encoded email address

      const foundCustomer = await customer.findOne({
        where: {userId: decodedUserId},
      });

      if (!foundCustomer) {
        return res.status(404).json({message: 'Customer not found.'});
      }

      return res.status(200).json(foundCustomer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Error retrieving customer.'});
    }
  }
);

export default router;
