import { IsNotEmpty, IsString } from 'class-validator';

export class NotesDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  anotation: string;
}
