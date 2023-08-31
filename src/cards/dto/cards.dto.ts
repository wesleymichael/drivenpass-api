import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CardsDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cvv: string;

  @IsString()
  @IsNotEmpty()
  exp: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  isVirtual: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isCredit: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDebit: boolean;
}
