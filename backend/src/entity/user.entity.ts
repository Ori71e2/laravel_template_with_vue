import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  account: string;

  @Column({ length: 2048 })
  password: string;

  @Column()
  vip: number;

  @Column()
  vipExpiretime: number;

  @Column()
  isActive: boolean;

  @Column()
  activeCode: number;

  @Column()
  activeCodeExpiretime: number;
}