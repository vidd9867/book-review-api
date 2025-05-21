import { Request, Response } from 'express';
import { Router } from 'express';
import { BookBLL } from '../bll/book.bll';


const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const search = (req.query.keyword as string || '').trim();
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!search) {
            res.status(400).send('Query parameter search is required.');
            return;
        }

        const searchedBooks = await new BookBLL().searchBooks(search, page, limit);

        if (!searchedBooks) {
            res.status(400).send('Failed to search books');
            return;
        }

        res.status(200).json(searchedBooks);

    } catch (error) {
        res.status(500).send(`Method: get \nClass: search \nError: '${error}'`);
    }

});

export default router;