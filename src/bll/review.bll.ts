import { BookDAL } from "../dal/book.dal";
import { ReviewDAL } from "../dal/review.dal";
import { Reviews } from "../entities/Reviews";
import { IMessage } from "../interfaces/IMessage";
import { IReviewsRecords } from "../interfaces/IRecords";

export class ReviewBLL {
    private reviewDAL: ReviewDAL;
    private bookDAL: BookDAL;
    constructor() {
        this.reviewDAL = new ReviewDAL();
        this.bookDAL = new BookDAL();
    }

    async getBookDetailsById(bookId: string, page: number = 1, limit: number = 10): Promise<IReviewsRecords | IMessage> {
        try {
            const skip = (page - 1) * limit;

            const bookDetails = await this.bookDAL.getBookById(bookId);
            if (!bookDetails) {
                return { message: `Book with id: ${bookId} not found` };
            }

            const [reviews, averageRating, totalReviews] = await Promise.all([
                this.reviewDAL.geReviewsByBookId(bookId, skip, limit),
                this.reviewDAL.getReviewsAverageRating(bookId),
                this.reviewDAL.getTotalReviewsCount(bookId)
            ]);

            return {
                bookDetails,
                averageRating,
                reviews: { records: reviews, count: totalReviews, totalPages: Math.ceil(totalReviews / limit) }
            };
        } catch (error) {
            throw new Error(`Method: getBookDetailsById \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async saveBookReview(bookId: string, review: string, rating: number, createdBy: string): Promise<Reviews[] | IMessage> {
        try {
            // Check if the user have already reviewed the book
            const existingReview = await this.reviewDAL.getExistingReview(bookId, createdBy);
            if (existingReview) {
                return { message: `User already reviewed the book ${bookId}` };
            }
            const existingBook = await this.bookDAL.getBookById(bookId);
            if (!existingBook) {
                return { message: `Book with id: ${bookId} not found` };
            }
            // Create a new book review
            const newReview = await this.reviewDAL.addReview({
                bookId,
                review,
                rating,
                createdBy
            });

            return newReview;
        } catch (error) {
            throw new Error(`Method: saveBookReview \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async updateBookReview(reviewId: string, createdBy: string, review?: string, rating?: number): Promise<Reviews | IMessage> {
        try {
            // Create a update book review
            const updatedReview = await this.reviewDAL.updateExistingReview(
                reviewId,
                { review, rating }
            );

            if (!updatedReview) {
                return { message: `Review with id: ${reviewId} not found` };
            }

            return updatedReview;
        } catch (error) {
            throw new Error(`Method: updateBookReview \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async deleteBookReview(reviewId: string, createdBy: string): Promise<Reviews | IMessage> {
        try {
            // Create a delete book review
            const deletedReview = await this.reviewDAL.deleteExistingReview(reviewId, createdBy);

            if (!deletedReview) {
                return { message: `Review with id: ${reviewId} not found` }
            }

            return deletedReview;
        } catch (error) {
            throw new Error(`Method: deleteBookReview \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }


}