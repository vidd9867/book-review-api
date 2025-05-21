
import { Request, Response } from 'express';
import { Router } from 'express';
import { BookReviewBLL } from '../bll/book-review.bll';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if ( !email || !password ){
      res.sendStatus(400).send('Missing required fields: email or password');
    }

    const savedUser = await new BookReviewBLL().saveUser(email, password)

    if (savedUser?.message) {
      res.status(400).send(`${savedUser}`);
    }

    res.status(201).json(savedUser);

  } catch (error) {
    res.sendStatus(500).send(`Method: post \nClass: signup \nError: '${error}'`);
  }
});

export default router;