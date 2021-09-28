import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Post from '../posts/post.entity';
import { Expose } from 'class-transformer';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  @Expose()
  public id: number;

  @Column()
  @Expose()
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  @Expose()
  public posts: Post[];
}

export default Category;
