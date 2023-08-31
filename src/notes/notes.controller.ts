import { AuthGuard } from '@/guards/auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Get('/:id')
  async findNoteById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('Invalid ID format'),
      }),
    )
    id: number,
    @User() user: Users,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.notesService.findNoteById(id, user.id);
  }

  @Delete('/:id')
  async deleteNote(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('Invalid ID format'),
      }),
    )
    id: number,
    @User() user: Users,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.notesService.deleteNote(id, user.id);
  }
}
