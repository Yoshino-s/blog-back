import { Entity, Column, ManyToMany} from 'typeorm';
import { Base } from './Base';
import { Paragraph } from './Paragraph.entity';

@Entity()
export class Tag extends Base {
  @Column({ type: 'varchar', length: 32, nullable: false})
  name: string;

  @ManyToMany(() => Paragraph, paragraph => paragraph.tags)
  paragraphs: Paragraph[];
}