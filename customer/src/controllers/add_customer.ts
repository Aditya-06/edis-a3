import {Request, Response, Router} from 'express';
import {body, validationResult} from 'express-validator';
import hasTwoCharacters from '../middleware/customer';
import customer from '../models/customer';
import callKafkaMiddleware from '../middleware/kafka_crm';

const router = Router();

router.post(
  '/customers',
  [
    body('userId').isEmail().withMessage('Enter a valid email'),
    body('name').not().isEmpty().withMessage('No name provided'),
    body('phone').not().isEmpty().withMessage('No phone provided'),
    body('address').not().isEmpty().withMessage('No address provided'),
    body('city').not().isEmpty().withMessage('No city provided'),
    body('state').not().isEmpty().withMessage('No state provided'),
    body('zipcode').not().isEmpty().withMessage('No zipcode provided'),
  ],
  async (req: Request, res: Response): Promise<Response> => {
    // ensure all the items are present.
    // we can add more checks however, we stick to not empty ones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {userId, name, phone, address, address2, city, state, zipcode} =
      req.body;

    // ensure the state field is valid
    if (!hasTwoCharacters(state)) {
      return res.status(400).json({
        message: [
          {
            type: 'field',
            msg: 'State must have a 2 character code',
            path: 'state',
            location: 'body',
          },
        ],
      });
    }
    try {
      // Check for existing book with the same ISBN
      const existingCustomer = await customer.findOne({where: {userId}});

      if (existingCustomer) {
        return res.status(422).json({
          message: 'This user ID already exists in the system.',
        });
      }

      try {
        const newcustomer = await customer.create({
          userId,
          name,
          phone,
          address,
          address2,
          city,
          state,
          zipcode,
        });

        const baseUrl = req.baseUrl;
        const location = `${baseUrl}/${newcustomer.userId}`; // Construct location header

        // if all goes well -> call the Kafka middleware to the CRM service
        try {
          await callKafkaMiddleware(newcustomer);
        } catch (err) {
          console.log('error in kafka');
        }
        return res
          .status(201)
          .setHeader('Location', location)
          .json(newcustomer);
      } catch (error) {
        // Handle validation errors and other errors

        console.error(error);
        return res.status(400).json({message: 'Error adding customer.'});
      }
    } catch (e) {
      console.error(e);
      return res.status(400).json({message: 'Error adding customer.'});
    }
  }
);

export default router;
