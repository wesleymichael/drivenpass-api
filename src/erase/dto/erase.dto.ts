import { IsNotEmpty, IsString } from 'class-validator';

export class bodyDTO {
  @IsString()
  @IsNotEmpty()
  password: string;
}
