import { Entity, Column, ManyToMany, JoinTable, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './Base';
import { Content } from './Content.entity';

@Entity()
export class Paragraph extends Base {
  @Column({ type: 'varchar', length: 255 , default:''})
  title: string;

  @Column({ type: 'json', default: '{}'})
  metadata: Record<string, any>;

  @Column({ unique: true, nullable: false })
  Md5: string;

  @OneToOne(() => Content)
  @JoinColumn()
  paragraph: Content;

  @ManyToMany(() => Content)
  @JoinTable()
  media: Content[];

  @ManyToOne(() => Content)
  headPicture: Content;
}