import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  preferred_name: string;

  @Column()
  partner_name: string;

  @Column()
  relationship_start_date: Date;

}

// Create the SQL session table.
export { DatabaseSession } from '@foal/typeorm';
