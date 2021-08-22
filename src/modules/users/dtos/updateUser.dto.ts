import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { CoordinateInterface } from '../../../common/interfaces/coordinate.interface';
import { CoordinateTransform } from '../../../common/transforms/coordinate.transform';

export class UpdateUserDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
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
