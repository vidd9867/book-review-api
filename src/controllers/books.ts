
import { Request, Response } from 'express';
import { Router } from 'express';
import { BookReviewBLL } from '../bll/book-review.bll';
import { authenticateJWT } from '../utils/authentication';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, author, genre, userId } = req.body;

        if ( !title || !author || !genre ){
            res.status(400).send('Missing required fields: title or author or genre');
            return;
        }

        const createdBook = await new BookReviewBLL().saveBookDetails(title, author, genre, userId);

        res.status(200).json(createdBook);

    } catch (error) {
        res.status(500).send(`Method: post \nClass: books \nError: '${error}'`);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if ( !id ){
            res.status(400).send('Missing required field: id');
            return;
        }

        const bookDetails = await new BookReviewBLL().getBookDetailsById(id);

        if (bookDetails?.message){
            res.status(400).send(`${bookDetails.message}`);
            return;
        }

        res.status(200).json(bookDetails);

    } catch (error) {
        res.status(500).send(`Method: post \nClass: books \nError: '${error}'`);
    }
});

router.post('/:id/reviews', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { review, rating, userId } = req.body;

        if ( !id || !review || !rating ){
            res.status(400).send('Missing required fields: id or review or rating');
            return;
        }

        if( review.length > 500 ){
            res.status(400).send('Review must not be more than 500 characters');
            return;
        }

        if( rating < 0 || rating > 9.9 ){
            res.status(400).send('Rating must be between 0.0 to 9.9');
            return;
        }

        const createdReview = await new BookReviewBLL().saveBookReview(id, review, rating, userId);

        res.status(200).json(createdReview);

        return;

    } catch (error) {
        res.status(500).send(`Method: post \nClass: books \nError: '${error}'`);
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const author = req.query.author as string | undefined;
        const genre = req.query.genre as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const filters: any = {};
        if (author) filters.author = author;
        if (genre) filters.genre = genre;

        const bookReviews = await new BookReviewBLL().getAllBooks(filters, page, limit);

        if (!bookReviews){
            res.status(400).send(`No books found`);
            return;
        }

        res.status(200).json(bookReviews);

    } catch (error) {
        res.status(500).send(`Method: post \nClass: books \nError: '${error}'`);
    }
});

export default router;