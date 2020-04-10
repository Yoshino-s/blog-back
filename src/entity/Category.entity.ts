import { Entity, Column, OneToMany} from 'typeorm';
import { Base } from './Base';
import { Paragraph } from './Paragraph.entity';

@Entity()
export class Category  extends Base {
  @Column({ type: 'varchar', length: 32, nullable: false})
  name: string;

  @OneToMany(() => Paragraph, paragraph => paragraph.category)
  paragraphs: Paragraph[];
}