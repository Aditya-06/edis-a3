import {Request, Response, Router} from 'express';
import {param, body, validationResult} from 'express-validator';
import hasTwoDecimals from '../middleware/book';

import Book from '../models/books';

const router = Router();

router.put(
  '/books/:ISBN',
  [
    // Ensure ID is provided in params
    param('ISBN').not().isEmpty().withMessage('No book ID provided'),
    body('ISBN').not().isEmpty().withMessage('No ID provided'),
    body('title').not().isEmpty().withMessage('No title provided'),
    body('Author').not().isEmpty().withMessage('No author provided'),
    body('description').not().isEmpty().withMessage('No description provided'),
    body('genre').not().isEmpty().withMessage('No genre provided'),
    body('price').not().isEmpty().withMessage('No price provided'),
    body('quantity').not().isEmpty().withMessage('No quantity provided'),
  ],
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors});
    }

    const {ISBN} = req.params;
    const {title, Author, description, genre, price, quantity} = req.body;

    try {
      // Find the book to update
      const bookToUpdate = await Book.findByPk(ISBN);

      if (!bookToUpdate) {
        return res.status(404).json({message: 'Book not found.'});
      }

      bookToUpdate.title = title;
      bookToUpdate.Author = Author;
      bookToUpdate.description = description;
      bookToUpdate.genre = genre;
      bookToUpdate.price = price;
      bookToUpdate.quantity = quantity;

      // Validate price format (optional)
      if (price && !hasTwoDecimals(price)) {
        // console.log(`Price is: ${price}`);
        return res.status(400).json({
          errors: [
            {
              type: 'field',
              msg: 'Price must be a number with 2 decimal places',
              path: 'price',
              location: 'body',
            },
          ],
        });
      }

      // Save the updated book
      await bookToUpdate.save();
      const formatNewBook = {
        ...bookToUpdate.dataValues,
        price: Number(bookToUpdate.price),
      };

      return res.status(200).json(formatNewBook); // Return the updated book data
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Error updating book.'});
    }
  }
);

export default router;
