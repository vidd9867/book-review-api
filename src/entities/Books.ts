import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Reviews } from "./Reviews";

@Index("createdBy", ["createdBy"], {})
@Entity("books", { schema: "bookdb_main" })
export class Books {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { name: "title", nullable: true, length: 100 })
  title: string | null;

  @Column("varchar", { name: "author", nullable: true, length: 100 })
  author: string | null;

  @Column("varchar", { name: "genre", nullable: true, length: 100 })
  genre: string | null;

  @Column("tinyint", {
    name: "isActive",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isActive: boolean | null;

  @Column("char", { name: "createdBy", nullable: true, length: 36 })
  createdBy: string | null;

  @Column("datetime", {
    name: "createdAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", { name: "updatedAt", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.books, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "createdBy", referencedColumnName: "id" }])
  createdBy2: Users;

  @OneToMany(() => Reviews, (reviews) => reviews.book)
  reviews: Reviews[];
}
