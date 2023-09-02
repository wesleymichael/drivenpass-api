import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NotesDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Meeting Notes',
    description: 'Title for note',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'The next meeting was scheduled for 05/12',
    description: 'Description for note',
  })
  anotation: string;
}
