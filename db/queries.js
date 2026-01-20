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
      totalVolumes: null,
    },
  });
}

async function findCollection(userId, title) {
  return prisma.book.findFirst({
    where: {
      userId,
      title: {
        equals: title,
        mode: "insensitive",
      },
      totalVolumes: {
        not: null,
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
      totalVolumes: null,
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
    select: {
      id: true,
      title: true,
    },
  });
}

async function deleteWishlist(id) {
  return prisma.book.delete({
    where: { id },
  });
}

async function isAlreadyAdded(title, userId) {
  return prisma.book.findFirst({
    where: {
      userId,
      title: {
        equals: title,
        mode: "insensitive",
      },
      totalVolumes: {
        not: null,
      },
    },
  });
}

async function updateWishlist(totalRead, totalVolumes, bookId) {
  return prisma.book.update({
    where: {
      id: bookId,
    },
    data: { totalRead, totalVolumes },
    select: {
      id: true,
      title: true,
      totalRead: true,
      totalVolumes: true,
    },
  });
}

async function findUserCollection(userId) {
  return prisma.book.findMany({
    where: {
      userId,
      totalVolumes: {
        not: null,
      },
    },
    select: {
      id: true,
      title: true,
      totalVolumes: true,
      totalRead: true,
    },
  });
}

async function addCollection(userId, title, totalVolumes, totalRead) {
  return prisma.book.create({
    data: {
      title,
      totalRead,
      totalVolumes,
      userId,
    },
    select: {
      id: true,
      title: true,
      totalRead: true,
      totalVolumes: true,
    },
  });
}

async function findCollectionById(bookId) {
  return prisma.book.findFirst({
    where: {
      id: bookId,
      totalVolumes: {
        not: null,
      },
    },
    select: {
      id: true,
      userId: true,
      title: true,
    },
  });
}

async function removeCollection(id) {
  return prisma.book.delete({
    where: {
      id,
    },
  });
}

export default {
  findUserByUsername,
  createUser,
  findCollection,
  findWishlist,
  findUserWishlist,
  findWishlistById,
  addWishlist,
  deleteWishlist,
  isAlreadyAdded,
  updateWishlist,
  findUserCollection,
  addCollection,
  findCollectionById,
  removeCollection,
};
