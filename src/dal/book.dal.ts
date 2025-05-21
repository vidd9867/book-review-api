import { Repository, DataSource, DeleteResult } from "typeorm";
import { Users } from "../entities/Users";
import { IUsers } from "../interfaces/IUsers"; // Ensure this points to your IUsers interface
import { AppDataSource } from "../config/db"; // Ensure this points to your DataSource configuration
import { Books } from "../entities/Books";
import { Reviews } from "../entities/Reviews";
import { IBookFilter, IBooks } from "../interfaces/IBooks"; // Ensure this points to your IBooks interface
import { IReviews } from "../interfaces/IReviews";
import { IRecords } from "../interfaces/IRecords";
//import { IReviews } from "../interfaces/IReviews"; // Ensure this points to your IReviews interface
// Removed the Connection import as it is not needed


export class BookDAL {

    private connection: DataSource;

    private booksRepository: Repository<Books>; 

    constructor() {
        this.connection = AppDataSource; 
        this.booksRepository = this.connection.getRepository(Books);
    }

    async createBookDetails(bookDetails: IBooks) {
        const book = this.booksRepository.create(bookDetails); 
        return await this.booksRepository.save(book); 
    }

    async getAllBooks(filter: IBookFilter, skip: number, limit: number): Promise<IRecords<IBooks[]>> {
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
        query = query.andWhere("bk.isActive = :isActive", { isActive: true });

        const bookList =  await query.orderBy("bk.createdAt", "DESC").skip(skip).take(limit).getRawMany<IBooks>();
        const totalBooks = await this.booksRepository.count();

        return {records: bookList, count: totalBooks, totalPages: Math.ceil(totalBooks / limit)};
    }

    async getBookById(bookId: string): Promise<Books | null> {
        return await this.booksRepository.findOneBy({id: bookId, isActive: true}); 
    }

    async searchBooks(search: string, skip: number, limit: number): Promise<IRecords<IBooks[]>> {

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
            .where(`bk.title LIKE '${`%${search}%`}' or bk.author LIKE '${`%${search}%`}'`)
            .orderBy("bk.createdAt", "DESC")
            .skip(skip)
            .take(limit)
            .getRawMany();

        const totalBooks = await this.booksRepository.count();

        return {records: searchedResult, count: totalBooks, totalPages: Math.ceil(totalBooks / limit)};
    }

}