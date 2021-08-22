import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoordinateInterface } from '../common/interfaces/coordinate.interface';
import { DatabaseCoordinateInterface } from '../common/interfaces/databaseCoordinate.interface';

@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'system' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int8', name: 'id' })
  id: number;

  @Column('character varying', { name: 'first_name', length: 50 })
  firstName: string;

  @Column('character varying', { name: 'last_name', length: 50 })
  lastName: string;

  @Column('character varying', {
    name: 'password',
    length: 100,
    nullable: true,
    select: false,
  })
  password?: string;

  @Column('character varying', { name: 'email', length: 100 })
  email: string;

  @Column('text', { name: 'address', nullable: true })
  address?: string;

  @Column('character varying', { name: 'status', length: 50 })
  status: string;

  @Column('character varying', { name: 'phone', length: 50 })
  phone: string;

  @Column('point', { name: 'coordinate', nullable: true })
  coordinate?: CoordinateInterface | string | DatabaseCoordinateInterface;

  @Column('int8', { name: 'region_level_3', nullable: true })
  regionLevel3?: number;

  @Column('date', { name: 'birth_date', nullable: true })
  birthDate?: Date;

  @Column('int8', { name: 'creator', nullable: true, select: false })
  creator?: number;

  @Column('point', {
    name: 'creator_coordinate',
    nullable: true,
    select: false,
  })
  creatorCoordinate?:
    | CoordinateInterface
    | string
    | DatabaseCoordinateInterface;

  @Column('character varying', {
    name: 'creator_ip',
    length: 50,
    nullable: true,
    select: false,
  })
  creatorIp?: string;

  @Column('timestamp without time zone', {
    name: 'creation_date',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate?: Date;

  @Column('int8', { name: 'modifier', nullable: true, select: false })
  modifier?: number;

  @Column('point', {
    name: 'modifier_coordinate',
    nullable: true,
    select: false,
  })
  modifierCoordinate?:
    | CoordinateInterface
    | string
    | DatabaseCoordinateInterface;

  @Column('character varying', {
    name: 'modifier_ip',
    length: 50,
    nullable: true,
    select: false,
  })
  modifierIp?: string;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'modification_date',
    nullable: true,
    select: false,
  })
  modificationDate?: Date;

  @Column({
    type: 'timestamp without time zone',
    name: 'last_login',
    nullable: true,
    select: false,
  })
  lastLogin?: Date;
}
