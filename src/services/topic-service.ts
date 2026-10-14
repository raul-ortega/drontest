import { prisma } from "@/lib/prisma";

export async function getTopics(categoryId?: string) {
  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;

  return prisma.topic.findMany({
    where,
    include: {
      category: { select: { name: true } },
      _count: { select: { questions: true } },
    },
    orderBy: { order: "asc" },
  });
}

export async function getTopicById(id: string) {
  return prisma.topic.findUnique({
    where: { id },
    include: {
      category: true,
      questions: { select: { id: true } },
    },
  });
}

export async function createTopic(data: {
  name: string;
  categoryId: string;
  description?: string | null;
  order?: number;
}) {
  return prisma.topic.create({ data });
}

export async function updateTopic(
  id: string,
  data: {
    name?: string;
    categoryId?: string;
    description?: string | null;
    order?: number;
    isActive?: boolean;
  }
) {
  return prisma.topic.update({ where: { id }, data });
}

export async function deleteTopic(id: string) {
  await prisma.topic.delete({ where: { id } });
}
