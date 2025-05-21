import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import { Users } from "../entities/Users";
import { IUsers } from "../interfaces/IUsers";

export class UserDAL {

    private connection: DataSource;

    private usersRepository: Repository<Users>;
    constructor() {
        this.connection = AppDataSource;
        this.usersRepository = this.connection.getRepository(Users);
    }

    async createUser(userDetails: IUsers) {
        const user = this.usersRepository.create(userDetails);
        return await this.usersRepository.save(userDetails);
    }

    async getUserByEmail(email: string) {
        return await this.usersRepository.findOneBy({ email: email, isActive: true });
    }

    async getUserById(userId: string) {
        return await this.usersRepository.findOneBy({ id: userId, isActive: true });
    }

    async deleteUser(userId: string) {
        return await this.usersRepository.delete(userId);
    }

}