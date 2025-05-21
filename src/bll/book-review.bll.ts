import { BookReviewDAL } from '../dal/book-review.dal';
import { encryptPassword, comparePassword, generateToken, verifyToken } from '../utils/encrpyt';
import { IUsersToken } from '../interfaces/IUsers'; // Ensure this points to your IUsers interface
import { IBookFilter, IBooks } from '../interfaces/IBooks'; // Ensure this points to your IBooks interface
import { IReviews } from '../interfaces/IReviews';

export class BookReviewBLL {
    private bookReviewDal: BookReviewDAL;

    constructor() {
        this.bookReviewDal = new BookReviewDAL();
    }

    async saveUser(email: string, password: string): Promise<any> {
        try {
            // Check if the user already exists
            const existingUser = await this.bookReviewDal.getUserByEmail(email);

            if (existingUser) {
                return { existingUser, message: 'User already exists' };
            }

            // Encrypt the password
            const encryptedPassword = await encryptPassword(password);

            // Create a new user
            const newUser = await this.bookReviewDal.createUser({
                email,
                password: encryptedPassword
            });

            return newUser
        } catch (error) {
            throw new Error(`Method: saveUser \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async loginUser(email: string, password: string): Promise<any> {
        try {
            // Check if the user already exists
            const existingUser = await this.bookReviewDal.getUserByEmail(email);

            if (!existingUser) {
                return { message: `Invalid User ${email}` }
            }

            if (!existingUser?.password || !(await comparePassword(password, existingUser.password)))
                return { message: "Invalid credentials" }

            // if(existingUser?.sessiontoken){
            //     const token = authentication(existingUser?.sessiontoken);

            // }

            return { uid: existingUser.id, email: existingUser.email, token: generateToken({ id: existingUser.id, email: existingUser.email }) }
        } catch (error) {
            throw new Error(`Method: loginUser \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async isUserValid(userId: string): Promise<any> {
        try {
            // Check if the user already exists
            const existingUser = await this.bookReviewDal.getUserById(userId);

            if (!existingUser) {
                return { message: `Invalid User ${userId}` }
            }

            return { uid: existingUser.id, email: existingUser.email }
        } catch (error) {
            throw new Error(`Method: isUserValid \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async saveBookDetails(title: string, author: string, genre: string, createdBy: string): Promise<IBooks> {
        try {
            // Create a new book
            const newBook = await this.bookReviewDal.createBookDetails({
                title,
                author,
                genre,
                createdBy
            });

            return newBook;
        } catch (error) {
            throw new Error(`Method: saveBookDetails \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async getAllBooks(filter: IBookFilter , page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const books = await this.bookReviewDal.getAllBooks(filter, skip, limit);

            if (!books) {
                return { message: 'No books found' };
            }

            return {
                books: books.bookList,
                pagination: {
                    page,
                    limit,
                    totalFilteredBooks: books.bookList.length,
                    totalBooks: books.totalBooks,
                    totalPages: Math.ceil(books.totalBooks / limit)
                }
            };
        } catch (error) {
            throw new Error(`Method: getAllBooks \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async getBookDetailsById(bookId: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const bookDetails = await this.bookReviewDal.getBookById(bookId);
                if (!bookDetails) {
                    return { error: true, message: `Book with id: ${bookId} not found` };
                }
            
            const [ reviews, averageRating, totalReviews ] = await Promise.all([
                this.bookReviewDal.geReviewsByBookId(bookId, skip, limit),
                this.bookReviewDal.getReviewsAverageRating(bookId),
                this.bookReviewDal.getTotalReviewsCount(bookId)
            ]);

            return {
                bookDetails,
                averageRating,
                reviews,
                pagination: {
                    page,
                    limit,
                    totalReviews,
                    totalPages: Math.ceil(totalReviews / limit)
                }
            };
        } catch (error) {
            throw new Error(`Method: getBookDetailsById \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async saveBookReview(bookId: string, review: string, rating: number, createdBy: string) {
        try {
            // Check if the user have already reviewed the book
            const existingReview = await this.bookReviewDal.getExistingReview(bookId, createdBy);
            if (existingReview) {
                return { message: `User already reviewed the book ${bookId}` };
            }
            // Create a new book review
            const newReview = await this.bookReviewDal.addReview({
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

    async updateBookReview(reviewId: string, createdBy: string, review?: string, rating?: number) {
        try {
            // Create a update book review
            const updatedReview = await this.bookReviewDal.updateExistingReview(
                reviewId,
                {review,rating},
                createdBy
            );

            if (!updatedReview) {
                return { message: `Review with id: ${reviewId} not found` };
            }

            return updatedReview;
        } catch (error) {
            throw new Error(`Method: updateBookReview \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async deleteBookReview(reviewId: string, createdBy: string) {
        try {
            // Create a delete book review
            const deletedReview = await this.bookReviewDal.deleteExistingReview(reviewId, createdBy);

            if (!deletedReview) {
                return {message: `Review with id: ${reviewId} not found`}
            }

            return deletedReview;
        } catch (error) {
            throw new Error(`Method: deleteBookReview \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async searchBooks(search: string, page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;

            const books = await this.bookReviewDal.searchBooks(search, skip, limit);

            if (!books) {
                return { message: 'No Search found' };
            }

            return {
                books: books.searchedResult,
                pagination: {
                    page,
                    limit,
                    searchedResults: books.searchedResult.length,
                    totalBooks: books.totalBooks,
                    totalPages: Math.ceil(books.totalBooks / limit)
                }
            }
        } catch (error) {
            throw new Error(`Method: searchBooks \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

}