import { ApiProperty } from '@nestjs/swagger';
import { NotesDTO } from './notes.dto';

export class NoteResponse extends NotesDTO {
  @ApiProperty({ type: 'number', example: 7 })
  id: number;

  @ApiProperty({ type: 'number', example: 1 })
  userId: number;

  @ApiProperty({ type: 'string', example: '2023-09-02T03:39:44.766Z' })
  createdAt: string;

  @ApiProperty({ type: 'string', example: '2023-09-02T03:39:44.766Z' })
  updatedAt: string;
}
