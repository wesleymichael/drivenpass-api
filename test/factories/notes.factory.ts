import { NotesDTO } from '@/notes/dto/notes.dto';
import { PrismaService } from '@/prisma/prisma.service';

export class NotesFactory {
  private bodyNote: NotesDTO;
  private userId: number;

  constructor(private readonly prisma: PrismaService) {}

  withBodyNote(body: NotesDTO) {
    this.bodyNote = body;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      ...this.bodyNote,
      userId: this.userId,
    };
  }

  async persist() {
    const user = this.build();
    return await this.prisma.notes.create({
      data: user,
    });
  }
}
