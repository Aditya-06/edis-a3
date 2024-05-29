import {Request, Response, Router} from 'express';
import {body, validationResult} from 'express-validator';
import hasTwoDecimals from '../middleware/book';

import Book from '../models/books';

const router = Router();

router.post(
  '/books',
  [
    body('ISBN').not().isEmpty().withMessage('No ISBN provided'),
    body('title').not().isEmpty().withMessage('No title provided'),
    body('Author').not().isEmpty().withMessage('No author provided'),
    body('description').not().isEmpty().withMessage('No description provided'),
    body('genre').not().isEmpty().withMessage('No genre provided'),
    body('price').not().isEmpty().withMessage('No price provided'),
    body('quantity').not().isEmpty().withMessage('No quantity provided'),
  ],
  async (req: Request, res: Response): Promise<Response> => {
    // ensure all the items are present.
    // we can add more checks however, we stick to not empty ones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: errors.array()});
    }

    const {ISBN, title, Author, description, genre, price, quantity} = req.body;

    try {
      // Check for existing book with the same ISBN
      const existingBook = await Book.findOne({where: {ISBN}});
      if (existingBook) {
        return res.status(422).json({
          message: 'This ISBN already exists in the system.',
        });
      }

      if (!hasTwoDecimals(price)) {
        return res.status(400).json({
          message: [
            {
              type: 'field',
              msg: 'Price must be 2 decimal places',
              path: 'Price',
              location: 'body',
            },
          ],
        });
      }

      try {
        const newBook = await Book.create({
          ISBN,
          title,
          Author,
          description,
          genre,
          price,
          quantity,
        });

        const baseUrl = req.baseUrl;
        const location = `${baseUrl}/${newBook.ISBN}`; // Construct location header
        // format this because of string parsing error
        // this is a quick fix -> solved
        const formatNewBook = {
          ...newBook.dataValues,
          price: Number(newBook.price),
        };

        return res
          .status(201)
          .setHeader('Location', location)
          .json(formatNewBook);
      } catch (error) {
        console.error(error);
        return res.status(400).json({message: 'Error adding book.'});
      }
    } catch (e) {
      console.error(e);
      return res.status(400).json({message: 'Error adding book.'});
    }
  }
);

export default router;
