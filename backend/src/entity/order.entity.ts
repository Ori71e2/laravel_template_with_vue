import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1024 })
  payjs: string;

  @Column()
  createtime: number;

  @Column()
  userId: number;
}