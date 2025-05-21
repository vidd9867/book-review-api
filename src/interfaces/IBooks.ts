export interface IBooks {
    id?: string; 
    title: string | null;
    author: string | null;
    genre: string | null;
    isActive?: boolean | null;
    createdBy?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface IBookFilter {
    author: string;
    genre: string;
}