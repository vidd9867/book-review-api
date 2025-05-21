export interface IReviews {
    id?: string;
    bookId: string | null;
    review: string | null;
    rating: number | null;
    createdBy: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    avg?: number;
}

export interface IUpdateReview {
    review?: string | null;
    rating?: number | null;
}