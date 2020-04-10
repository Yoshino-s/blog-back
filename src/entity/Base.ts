import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Base extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;
}