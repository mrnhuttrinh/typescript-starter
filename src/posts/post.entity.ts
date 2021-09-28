import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import User from 'src/users/user.entity';
import Category from 'src/categories/category.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  @Expose()
  public id: number;

  @Column()
  @Expose()
  public title: string;

  @Column()
  @Expose()
  public content: string;

  @Column({ nullable: true })
  @Expose()
  public category?: string;

  @ManyToOne(() => User, (author: User) => author.posts)
  @Expose()
  public author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  @Expose()
  public categories: Category[];
}

export default Post;
