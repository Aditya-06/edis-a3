import {Request, Response, Router} from 'express';

import customer from '../models/customer';
import {param, validationResult} from 'express-validator';

const router = Router();

router.get(
  '/customers/:id',
  [param('id').isNumeric().withMessage('Enter a valid ID')],
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {id} = req.params;

    console.log(`the Id is: ${Number(id)}`);
    if (!id && isNaN(Number(id))) {
      return res.status(400).json({message: 'No Id provided'});
    }

    try {
      const foundCustomer = await customer.findByPk(id);

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
