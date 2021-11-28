// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Activity } from './activity.entity';

@Entity()
export class Progress extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, { nullable: false })
  user: User;

  @ManyToOne(type => Activity, { nullable: false })
  activity: Activity;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  date_of_completion: Date;

  @Column({ nullable: true })
  notes: string;

}
