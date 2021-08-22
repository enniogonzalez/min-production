import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CoordinateInterface } from '../../../common/interfaces/coordinate.interface';
import { CoordinateTransform } from '../../../common/transforms/coordinate.transform';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  address?: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @Transform(CoordinateTransform)
  coordinate?: CoordinateInterface;

  @IsOptional()
  regionLevel3?: number;

  @IsOptional()
  birthDate?: Date;
}
