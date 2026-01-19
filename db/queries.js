import { prisma } from "../lib/prisma.js";

async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
  });
}

async function createUser(username, hashedPassword) {
  return prisma.user.create({
    data: { username, password: hashedPassword },
  });
}

async function findWishlist(userId, title) {
  return prisma.book.findFirst({
    where: {
      userId,
      title: {
        equals: title,
        mode: "insensitive",
      },
    },
  });
}

async function findUserWishlist(userId) {
  return prisma.book.findMany({
    where: {
      userId,
      totalVolumes: null,
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

async function findWishlistById(bookId) {
  return prisma.book.findFirst({
    where: {
      id: bookId,
    },
    select: {
      id: true,
      userId: true,
      title: true,
    },
  });
}

async function addWishlist(userId, title) {
  return prisma.book.create({
    data: { userId, title },
  });
}

async function deleteWishlist(id) {
  return prisma.book.delete({
    where: { id },
  });
}

export default {
  findUserByUsername,
  createUser,
  findWishlist,
  findUserWishlist,
  findWishlistById,
  addWishlist,
  deleteWishlist,
};
