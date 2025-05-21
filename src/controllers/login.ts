
import { Request, Response } from 'express';
import { Router } from 'express';
import { BookReviewBLL } from '../bll/book-review.bll';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
    
        if ( !email || !password ){
        res.status(400).send('Missing required fields: email or password');
        return;
        }
    
        const loggedUser = await new BookReviewBLL().loginUser(email, password)

        if(loggedUser?.message){
            res.status(400).send(`${loggedUser?.message}`);
            return;
        }

        res.status(200).json(loggedUser);
    
    } catch (error) {
        res.status(500).send(`Method: post \nClass: login \nError: '${error}'`);
    }
    
});

export default router;