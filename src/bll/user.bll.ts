import { UserDAL } from "../dal/user.dal";
import { Users } from "../entities/Users";
import { IMessage, IUserMessage } from "../interfaces/IMessage";
import { IUsers, IUsersToken } from "../interfaces/IUsers";
import { comparePassword, encryptPassword, generateToken } from "../utils/encrpyt";

export class UserBLL {
    private userDAL: UserDAL;

    constructor() {
        this.userDAL = new UserDAL();
    }
    async saveUser(email: string, password: string): Promise<IUsers & Users | IUserMessage> {
        try {
            // Check if the user already exists
            const existingUser = await this.userDAL.getUserByEmail(email);

            if (existingUser) {
                return { existingUser, message: 'User already exists' };
            }

            // Encrypt the password
            const encryptedPassword = await encryptPassword(password);

            // Create a new user
            const newUser = await this.userDAL.createUser({
                email,
                password: encryptedPassword
            });

            return newUser
        } catch (error) {
            throw new Error(`Method: saveUser \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }


    async loginUser(email: string, password: string): Promise<IUsersToken | IMessage> {
        try {
            // Chseck if the user already exist
            const existingUser = await this.userDAL.getUserByEmail(email);

            if (!existingUser) {
                return { message: `Invalid User ${email}` }
            }

            if (!existingUser?.password || !(await comparePassword(password, existingUser.password)))
                return { message: "Invalid credentials" }

            return { id: existingUser.id, email: existingUser.email, sessiontoken: generateToken({ id: existingUser.id, email: existingUser.email }) }
        } catch (error) {
            throw new Error(`Method: loginUser \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }

    async isUserValid(userId: string): Promise<IUsers | IMessage> {
        try {
            // Check if the user already exists
            const existingUser = await this.userDAL.getUserById(userId);

            if (!existingUser) {
                return { message: `Invalid User ${userId}` }
            }

            return { id: existingUser.id, email: existingUser.email }
        } catch (error) {
            throw new Error(`Method: isUserValid \nClass: BookReviewBLL \nError: '${error}'`);
        }
    }
}