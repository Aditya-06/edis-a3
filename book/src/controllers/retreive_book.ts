import {Request, Response, Router} from 'express';

import Book from '../models/books';

const router = Router();

const retrieveBook = async (req: Request, res: Response): Promise<Response> => {
  const {ISBN} = req.params;
  if (!ISBN) {
    return res.status(404).json({message: 'No ISBN given'});
  }

  try {
    const book = await Book.findOne({where: {ISBN}});

    if (!book) {
      return res.status(404).json({message: 'Book not found.'});
    }

    const formatNewBook = {
      ...book.dataValues,
      price: Number(book.price),
    };
    return res.status(200).json(formatNewBook);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Error retrieving book.'});
  }
};

router.get('/books/isbn/:ISBN', retrieveBook);
router.get('/books/:ISBN', retrieveBook);

export default router;
