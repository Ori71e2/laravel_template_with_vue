import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10485760 })
  list: string;

  @Column({ length: 524288 })
  tag: string;

  @Column()
  updatetime: number;
}