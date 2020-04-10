import { Entity, Column, ManyToMany, ManyToOne, JoinTable, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Base } from './Base';
import { Tag } from './Tag.entity';
import { Category } from './Category.entity';
import { User } from './User.entity';

@Entity()
export class Paragraph extends Base {
  @Index({fulltext: true})
  @Column({ type: 'varchar', length: 255 , default:''})
  title: string;
  
  @Index({fulltext: true})
  @Column({ type: 'varchar', length: 255 , default:''})
  description: string;

  @Column({ type: 'text', default:''})
  preview: string;

  @Column({ unique: true, nullable: false })
  Md5: string;

  
  @Column({ type: 'varchar', length: 255, default:''})
  paragraphLink: string;

  @Column({ type: 'longtext', nullable: false })
  paragraph: string;

  @Column({ type: 'varchar', length: 255, default:''})
  headPicture: string;

  @ManyToMany(() => Tag, tag => tag.paragraphs)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => User)
  postBy: User;
  
  @CreateDateColumn() createdAt: string

  @UpdateDateColumn() updatedAt: string
}