import {Request, Response, Router} from 'express';

const router = Router();

/*
=================================
DUMMY ROUTE
=================================
*/
const relatedBooks = async (req: Request, res: Response): Promise<Response> => {
  const {ISBN} = req.params;
  if (!ISBN) {
    return res.status(404).json({message: 'No ISBN given'});
  }

  setTimeout(() => {
    console.log('hello');
  }, 4000);

  const relBooks = [
    {
      ISBN: '978-0321815736',
      title: 'Software Architecture in Practice',
      Author: 'Bass, L.',
    },
    {
      ISBN: '978-0-321-55268-6',
      title: 'Documenting Software Architectures Second Edition',
      Author: 'Clements, P. et al',
    },
  ];

  return res.status(200).json(relBooks);
};

router.get('/books/:ISBN/reccs', relatedBooks);

export default router;
