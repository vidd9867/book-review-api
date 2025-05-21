import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Books } from "./Books";
import { Reviews } from "./Reviews";

@Entity("users", { schema: "bookdb_main" })
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  password: string | null;

  @Column("tinyint", {
    name: "isActive",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isActive: boolean | null;

  @Column("datetime", {
    name: "createdAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", { name: "updatedAt", nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Books, (books) => books.createdBy2)
  books: Books[];

  @OneToMany(() => Reviews, (reviews) => reviews.createdBy2)
  reviews: Reviews[];
}
