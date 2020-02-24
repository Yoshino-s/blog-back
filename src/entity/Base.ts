import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Base extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn() createdAt: string

  @UpdateDateColumn() updatedAt: string

}