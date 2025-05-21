import { DataSource, Repository } from "typeorm";
import { Reviews } from "../entities/Reviews";
import { AppDataSource } from "../config/db";
import { IReviews } from "../interfaces/IReviews";

export class ReviewDAL {
    private connection: DataSource;
    private reviewsRepository: Repository<Reviews>;
    constructor() {
        this.connection = AppDataSource;
        this.reviewsRepository = this.connection.getRepository(Reviews);
    }

    async geReviewsByBookId(bookId: string, skip: number, limit: number): Promise<Reviews[]> {

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
            .where(`bk.id = '${bookId}' and rv.isActive = true and bk.isActive = true and us.isActive = true`)
            .orderBy("rv.createdAt", "DESC")
            .skip(skip)
            .take(limit)
            .getRawMany<Reviews>();

        return geReviewsByBookId;
    }

    async getReviewsAverageRating(bookId: string): Promise<number> {
        const avgResult = await this.reviewsRepository
            .createQueryBuilder("rv")
            .select("AVG(rv.rating)", "avg")
            .where(`rv.bookId = '${bookId}' and rv.isActive = true`)
            .getRawOne<IReviews>();
        const averageRating = parseFloat(String(avgResult?.avg)) || 0

        return averageRating;
    }

    async getTotalReviewsCount(bookId: string): Promise<number> {
        const totalCount = await this.reviewsRepository.count({ where: { bookId, isActive: true } });

        return totalCount;
    }

    async addReview(reviewDetails: any): Promise<Reviews[]> {
        const review = this.reviewsRepository.create(reviewDetails);
        return await this.reviewsRepository.save(review);
    }

    async getExistingReview(bookId: string, userId: string): Promise<Reviews | null> {
        const getExistingReview = await this.reviewsRepository.findOne({
            where: {
                bookId: bookId,
                createdBy: userId,
                isActive: true
            }
        });
        if (!getExistingReview) {
            return getExistingReview;
        }

        return getExistingReview;
    }

    async updateExistingReview(reviewId: string, reviewDetails: any): Promise<Reviews | null> {
        const existingReview = await this.reviewsRepository.findOneBy({ id: reviewId, isActive: true });
        if (!existingReview) {
            return existingReview;
        }

        this.reviewsRepository.merge(existingReview, { ...reviewDetails, updatedAt: new Date() });
        const updatedReview = await this.reviewsRepository.save(existingReview);

        return updatedReview;
    }

    async deleteExistingReview(reviewId: string, userId: string): Promise<Reviews | null> {
        const existingReview = await this.reviewsRepository.findOneBy({ id: reviewId, createdBy: userId, isActive: true });
        if (!existingReview) {
            return existingReview;
        }
        this.reviewsRepository.merge(existingReview, { isActive: false, updatedAt: new Date() });
        // Set the isActive property to false  
        const deletedReview = await this.reviewsRepository.save(existingReview);

        return deletedReview;
    }

}