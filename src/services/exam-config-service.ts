import { prisma } from "@/lib/prisma";

export async function getExamConfigs() {
  return prisma.examConfig.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getExamConfigById(id: string) {
  return prisma.examConfig.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      topic: { select: { name: true } },
    },
  });
}

export async function createExamConfig(data: {
  name: string;
  description?: string | null;
  categoryId?: string | null;
  topicId?: string | null;
  questionCount: number;
  duration: number;
  passingScore: number;
  isActive?: boolean;
}) {
  return prisma.examConfig.create({ data });
}

export async function updateExamConfig(
  id: string,
  data: {
    name?: string;
    description?: string | null;
    categoryId?: string | null;
    topicId?: string | null;
    questionCount?: number;
    duration?: number;
    passingScore?: number;
    isActive?: boolean;
  }
) {
  return prisma.examConfig.update({ where: { id }, data });
}

export async function deleteExamConfig(id: string) {
  await prisma.examConfig.delete({ where: { id } });
}
