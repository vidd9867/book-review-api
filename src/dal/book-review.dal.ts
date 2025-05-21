import { Repository, DataSource } from "typeorm";
import { Users } from "../entities/Users";
import { IUsers } from "../interfaces/IUsers"; // Ensure this points to your IUsers interface
import { AppDataSource } from "../config/db"; // Ensure this points to your DataSource configuration
import { Books } from "../entities/Books";
import { Reviews } from "../entities/Reviews";
import { IBookFilter, IBooks } from "../interfaces/IBooks"; // Ensure this points to your IBooks interface
import { IReviews } from "../interfaces/IReviews";
//import { IReviews } from "../interfaces/IReviews"; // Ensure this points to your IReviews interface
// Removed the Connection import as it is not needed


export class BookReviewDAL {

    private connection: DataSource;

    private usersRepository: Repository<Users>;
    private booksRepository: Repository<Books>; 
    private reviewsRepository: Repository<Reviews>; 

    constructor() {
        this.connection = AppDataSource; 
        this.usersRepository = this.connection.getRepository(Users); 
        this.booksRepository = this.connection.getRepository(Books);
        this.reviewsRepository = this.connection.getRepository(Reviews);
    }

    async createUser(userDetails: IUsers) {
        const user = this.usersRepository.create(userDetails); 
        return await this.usersRepository.save(userDetails); 
    }

    async getUserByEmail(email: string) {
        return await this.usersRepository.findOneBy({email: email}); 
    }

    async getUserById(userId: string) {
        return await this.usersRepository.findOneBy({id: userId}); 
    }

    async deleteUser(userId: string) {
        return await this.usersRepository.delete(userId);
    }

    async getAllUsers() {
        return await this.usersRepository.find();
    }
    
    async createBookDetails(bookDetails: IBooks) {
        const book = this.booksRepository.create(bookDetails); 
        return await this.booksRepository.save(book); 
    }

    async getAllBooks(filter: IBookFilter, skip: number, limit: number) {
        let query = this.booksRepository.createQueryBuilder("bk")
        .select([
            "bk.id AS bookId",
            "bk.title AS title",
            "bk.author AS author",
            "bk.genre AS genre",
            "bk.isActive AS isActive",
            "bk.createdBy AS createdBy",
            "bk.createdAt AS createdAt",
            "bk.updatedAt AS updatedAt" 
        ]);

        if (filter.author) {
            query = query.where("bk.author = :author", { author: filter.author });
        }
        if (filter.genre) {
            query = query.andWhere("bk.genre = :genre", { genre: filter.genre });
        }

        const bookList =  await query.orderBy("bk.createdAt", "DESC").skip(skip).take(limit).getRawMany();
        const totalBooks = await this.booksRepository.count();

        return {bookList, totalBooks};
    }

    async getBookById(bookId: string) {
        return await this.booksRepository.findOneBy({id: bookId}); 
    }

    async geReviewsByBookId(bookId: string, skip: number, limit: number) {

        const geReviewsByBookId = this.reviewsRepository.createQueryBuilder("rv")
        .innerJoinAndSelect("rv.book", "bk")
        .innerJoinAndSelect("rv.createdBy2", "us")
        .select([
            "rv.id AS reviewId",
            "rv.review AS review",
            "rv.rating AS rating",
            "rv.createdAt AS createdAt",
            "us.id AS reviewerId",
            "us.email AS reviewerEmail"
        ])
        .where("bk.id = :bookId", { bookId: bookId })
        .orderBy("rv.createdAt", "DESC")
        .skip(skip)
        .take(limit)
        .getRawMany();

        return geReviewsByBookId
    }

    async getReviewsAverageRating(bookId: string) {
        const avgResult = await this.reviewsRepository
            .createQueryBuilder("rv")
            .select("AVG(rv.rating)", "avg")
            .where("rv.bookId = :bookId", { bookId })
            .getRawOne();
        const averageRating = parseFloat(avgResult.avg) || 0

        return averageRating;
    }

    async getTotalReviewsCount(bookId: string) {
        const totalCount = await this.reviewsRepository.count({ where: { bookId } });

        return totalCount;
    }

    async addReview(reviewDetails: any) {
        const review = this.reviewsRepository.create(reviewDetails); 
        return await this.reviewsRepository.save(review); 
    }

    async getExistingReview(bookId: string, userId: string) {
        const getExistingReview = await this.reviewsRepository.findOne({
            where: {
                bookId: bookId,
                createdBy: userId
            }
        });
        if (!getExistingReview) {   
            return getExistingReview;
        }

        return getExistingReview;
    }

    async updateExistingReview(reviewId: string, reviewDetails: any, userId: string) {
        const existingReview = await this.reviewsRepository.findOneBy({ id: reviewId });
        if (!existingReview) {
            return existingReview;
        }

        this.reviewsRepository.merge(existingReview, {...reviewDetails, updatedAt: new Date()});
        const updatedReview = await this.reviewsRepository.save(existingReview);
        
        return updatedReview;
    }

    async deleteExistingReview(reviewId: string, userId: string) {
        const existingReview = await this.reviewsRepository.findOneBy({ id: reviewId, createdBy: userId });
            if (!existingReview) {
                return existingReview;
            }

        return await this.reviewsRepository.delete(reviewId);
    }

    async searchBooks(search: string, skip: number, limit: number) {

        const searchedResult = await this.booksRepository.createQueryBuilder("bk")
            .select([ 
                "bk.id AS bookId",
                "bk.title AS title",
                "bk.author AS author",
                "bk.genre AS genre",
                "bk.isActive AS isActive",
                "bk.createdBy AS createdBy",
                "bk.createdAt AS createdAt",
                "bk.updatedAt AS updatedAt" 
            ])
            .where("bk.title LIKE :search", { search: `%${search}%` })
            .orWhere("bk.author LIKE :search", { search: `%${search}%` })
            .orderBy("bk.createdAt", "DESC")
            .skip(skip)
            .take(limit)
            .getRawMany();

        const totalBooks = await this.booksRepository.count();

        return {searchedResult, totalBooks};
    }

}