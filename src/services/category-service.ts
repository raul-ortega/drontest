import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      topics: { select: { id: true, name: true } },
      _count: { select: { questions: true } },
    },
    orderBy: { order: "asc" },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      topics: { orderBy: { order: "asc" } },
      questions: { select: { id: true } },
    },
  });
}

export async function createCategory(data: {
  name: string;
  description?: string | null;
  order?: number;
}) {
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string | null;
    order?: number;
    isActive?: boolean;
  }
) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
}
