import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUsersToken } from "../interfaces/IUsers"; // Ensure this points to your IUsers interface

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const encryptPassword = async (password: string) => bcrypt.hash(password, 10);

export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const generateToken = (userdetails: IUsersToken) =>
    jwt.sign({ userdetails }, JWT_SECRET, { expiresIn: "1d" });

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);