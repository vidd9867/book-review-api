import { BookDAL } from '../dal/book.dal';
import { encryptPassword, comparePassword, generateToken, verifyToken } from '../utils/encrpyt';
import { IUsers, IUsersToken } from '../interfaces/IUsers'; // Ensure this points to your IUsers interface
import { IBookFilter, IBooks } from '../interfaces/IBooks'; // Ensure this points to your IBooks interface
import { IReviews } from '../interfaces/IReviews';
import { Users } from '../entities/Users';
import { IMessage, IUserMessage } from '../interfaces/IMessage';
import { IRecords, IReviewsRecords } from '../interfaces/IRecords';
import { DeleteResult } from 'typeorm';
import { Reviews } from '../entities/Reviews';

export class BookBLL {
    private bookReviewDal: BookDAL;

    constructor() {
        this.bookReviewDal = new BookDAL();
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

    async getAllBooks(filter: IBookFilter, page: number = 1, limit: number = 10): Promise<IRecords<IBooks[]> | IMessage> {
        try {
            const skip = (page - 1) * limit;

            const books = await this.bookReviewDal.getAllBooks(filter, skip, limit);

            if (!books) {
                return { message: 'No books found' };
            }

            return books;
        } catch (error) {
            throw new Error(`Method: getAllBooks \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }
    async searchBooks(search: string, page: number, limit: number): Promise<IRecords<IBooks[]> | IMessage> {
        try {
            const skip = (page - 1) * limit;

            const books = await this.bookReviewDal.searchBooks(search, skip, limit);

            if (!books) {
                return { message: 'No Search found' };
            }

            return books;
        } catch (error) {
            throw new Error(`Method: searchBooks \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

}