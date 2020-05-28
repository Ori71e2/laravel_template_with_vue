import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1024 })
  email: string;

  @Column()
  emailToken: number;

  @Column()
  timestamp: number;

  constructor(email?: string, emailToken?: number, timestamp?: number)
  constructor(email: string, emailToken?: number, timestamp?: number)
  constructor(email: string, emailToken: number, timestamp?: number)
  constructor(email: string, emailToken: number, timestamp: number)
  constructor(email?: string, emailToken?: number, timestamp?: number) {
    this.email = email || '';
    this.emailToken = emailToken || 0;
    this.timestamp = timestamp || 0;
  }
}