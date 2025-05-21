import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Books } from "./Books";
import { Users } from "./Users";

@Index("bookId", ["bookId"], {})
@Index("createdBy", ["createdBy"], {})
@Entity("reviews", { schema: "bookdb_main" })
export class Reviews {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { name: "bookId", nullable: true, length: 100 })
  bookId: string | null;

  @Column("varchar", { name: "review", nullable: true, length: 500 })
  review: string | null;

  @Column("decimal", {
    name: "rating",
    nullable: true,
    precision: 2,
    scale: 1,
    default: () => "'0.0'",
  })
  rating: number | null;

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

  @ManyToOne(() => Books, (books) => books.reviews, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "bookId", referencedColumnName: "id" }])
  book: Books;

  @ManyToOne(() => Users, (users) => users.reviews, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "createdBy", referencedColumnName: "id" }])
  createdBy2: Users;
}
