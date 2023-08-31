import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotesDTO } from './dto/notes.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  createNotes(noteDTO: NotesDTO, userId: number) {
    return this.prisma.notes.create({
      data: {
        ...noteDTO,
        userId,
      },
    });
  }

  getNoteByTitleAndUserId(title: string, userId: number) {
    return this.prisma.notes.findUnique({
      where: {
        userId_title: {
          userId,
          title,
        },
      },
    });
  }

  findAllNotes(userId: number) {
    return this.prisma.notes.findMany({
      where: { userId: userId },
    });
  }

  findNoteById(id: number) {
    return this.prisma.notes.findUnique({
      where: { id },
    });
  }

  deleteNote(id: number) {
    return this.prisma.notes.delete({
      where: { id },
    });
  }
}
