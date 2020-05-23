import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'blob' })
  list: string;

  @Column({ type: 'blob' })
  tag: string;

  @Column()
  updatetime: number;

  @Column({ unique: true })
  userId: number;
  
  constructor(list: string, tag?: string, updatetime?: number, userId?: number)
  constructor(list: string, tag: string, updatetime?: number, userId?: number)
  constructor(list: string, tag: string, updatetime: number, userId?: number)
  constructor(list: string, tag: string, updatetime: number, userId: number)
  constructor(list?: string, tag?: string, updatetime?: number, userId?: number)
  constructor(list?: string, tag?: string, updatetime?: number, userId?: number) {
    this.list = list || '';
    this.tag = tag || '';
    this.updatetime = updatetime || 0;
    this.userId = userId || 0
  }
}