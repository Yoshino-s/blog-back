import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { User } from './User.entity';

enum Access {
  All, // Everyone
  Login, //must login
  Owner, //only owner & admin & root
  Admin, //only admin & root
}

@Entity()
export class Content extends Base {
  @Column({nullable: false})
  name: string;

  @Column({ nullable: false, default: '' })
  description: string;
  
  @Column({ unique: true, nullable: false })
  key: string;
  
  @Column({
    type: 'enum',
    default: Access.Owner,
    enum: Access
  })
  readAccess: Access;
    
  @Column({
    type: 'enum',
    default: Access.Owner,
    enum: Access
  })
  editAccess: Access;

  @ManyToOne(() => User, user => user.contents)
  postBy: User;
}