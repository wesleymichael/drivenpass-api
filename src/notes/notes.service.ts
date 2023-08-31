import { ConflictException, Injectable } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { NotesDTO } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(private readonly repository: NotesRepository) {}

  async createNote(noteDTO: NotesDTO, userId: number) {
    const note = await this.repository.getNoteByTitleAndUserId(
      noteDTO.title,
      userId,
    );
    if (note) {
      throw new ConflictException('A title with that name already exists.');
    }

    return await this.repository.createNotes(noteDTO, userId);
  }

  async findAllNotes(userId: number) {
    return await this.repository.findAllNotes(userId);
  }
}
