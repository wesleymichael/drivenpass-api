import { AuthGuard } from '@/guards/auth.guard';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesDTO } from './dto/notes.dto';
import { User } from '@/decorators/user.decorator';
import { Users } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async createNote(@Body() noteDTO: NotesDTO, @User() user: Users) {
    return await this.notesService.createNote(noteDTO, user.id);
  }

  @Get()
  async findAllNotes(@User() user: Users) {
    return await this.notesService.findAllNotes(user.id);
  }
}
