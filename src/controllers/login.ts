
import { Request, Response } from 'express';
import { Router } from 'express';
import { IMessage } from '../interfaces/IMessage';
import { UserBLL } from '../bll/user.bll';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
    
        if ( !email || !password ){
        res.status(400).send('Missing required fields: email or password');
        return;
        }
    
        const loggedUser = await new UserBLL().loginUser(email, password)

        if((loggedUser as IMessage)?.message){
            res.status(400).send(`${(loggedUser as IMessage)?.message}`);
            return;
        }

        res.status(200).json(loggedUser);
    
    } catch (error) {
        res.status(500).send(`Method: post \nClass: login \nError: '${error}'`);
    }
    
});

export default router;