import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import Address from './address.entity';
import Post from '../posts/post.entity';
import PublicFile from 'src/files/publicFile.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  @Expose()
  public id: number;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column()
  @Expose()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  @Expose()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  @Expose()
  public posts: Post[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  @Expose()
  public avatar?: PublicFile;
}

export default User;
