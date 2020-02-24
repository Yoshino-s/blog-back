import { Entity, Column } from 'typeorm';
import { Base } from './Base';

export enum USER_GROUP {
  NORMAL, ADMIN, ROOT
}

@Entity()
export class User extends Base {
  @Column({unique: true, nullable: false})
  name: string;

  @Column({nullable: false})
  password: string;

  @Column({nullable: false})
  email: string;

  @Column({nullable: false, default: false})
  verified: boolean;

  @Column({unique: true, nullable: false})
  verifyCode: string;

  @Column({type: 'varchar', length: 100, default: ''})
  introduction: string;

  @Column({
    type: 'enum',
    enum: USER_GROUP,
    default: USER_GROUP.NORMAL
  })
  userGroup: USER_GROUP;
}