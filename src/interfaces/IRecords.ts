import { Books } from "../entities/Books";
import { Reviews } from "../entities/Reviews";

export interface IRecords<T> {
    records: T,
    count: number,
    totalPages: number
}

export interface IReviewsRecords {
    bookDetails: Books;
    averageRating: number;
    reviews: IRecords<Reviews[]>;
}