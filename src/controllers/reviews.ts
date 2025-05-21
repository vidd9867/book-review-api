import { Request, Response } from 'express';
import { Router } from 'express';
import { BookBLL } from '../bll/book.bll';
import { authenticateJWT } from '../utils/authentication';
import { ReviewBLL } from '../bll/review.bll';

const router = Router();

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { review, rating, userId } = req.body;

        if ( !review && !rating ){
            res.status(400).send('Missing required fields: review or rating');
            return;
        }

        if( review && review.length > 500 ){
            res.status(400).send('Review length exceeds 500 characters');
            return;
        }

        if ( rating && (rating < 0 || rating > 9.9) ){
            res.status(400).send('Rating must be between 0.0 to 9.9');
            return;
        }

        const updatedReview = await new ReviewBLL().updateBookReview(id, userId, review, rating);

        if (!updatedReview) {
            res.status(400).send('Failed to update review');
            return;
        }

        res.status(200).json(updatedReview);

    } catch (error) {
        res.status(500).send(`Method: post \nClass: reviews \nError: '${error}'`);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if ( !id ){
            res.status(400).send('Missing required field: id');
            return;
        }

        const deletedReview = await new ReviewBLL().deleteBookReview(id, userId);

        if (!deletedReview) {
            res.status(400).send('Failed to delete review');
            return;
        }

        res.status(200).json(deletedReview);

    } catch (error) {
        res.status(500).send(`Method: post \nClass: reviews \nError: '${error}'`);
    }
});

export default router;