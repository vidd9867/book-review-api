import { Users } from "../entities/Users";

export interface IMessage {
    message: string;
}

export interface IUserMessage {
    existingUser: Users;
    message: string
}