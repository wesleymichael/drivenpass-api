import { PrismaService } from '@/prisma/prisma.service';

export async function cleanDB(prisma: PrismaService) {
  await prisma.wifi.deleteMany();
  await prisma.credentials.deleteMany();
  await prisma.notes.deleteMany();
  await prisma.cards.deleteMany();
  await prisma.users.deleteMany();
}
