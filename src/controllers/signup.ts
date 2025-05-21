
import { Request, Response } from 'express';
import { Router } from 'express';
import { IUserMessage } from '../interfaces/IMessage';
import { UserBLL } from '../bll/user.bll';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if ( !email || !password ){
      res.sendStatus(400).send('Missing required fields: email or password');
    }

    const savedUser = await new UserBLL().saveUser(email, password)

    if ((savedUser as IUserMessage)?.message) {
      res.status(400).send(`${(savedUser as IUserMessage)?.message}`);
      return;
    }

    res.status(201).json(savedUser);
    return

  } catch (error) {
    res.sendStatus(500).send(`Method: post \nClass: signup \nError: '${error}'`);
  }
});

export default router;