import { prisma } from "../lib/prisma.js";

async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
  });
}

async function getUserProfile(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
    },
  });
}

async function createUser(username, hashedPassword) {
  return prisma.user.create({
    data: { username, password: hashedPassword },
  });
}

async function updateUsername(userId, newUsername) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: newUsername,
    },
    select: {
      username: true,
    },
  });
}

async function updatePassword(userId, newPassword) {
  return prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
}

async function findUserById(id) {
  return prisma.user.findFirst({
    where: { id },
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
      addedAt: true,
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
      addedAt: true,
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

async function updateWishlist(totalRead, totalVolumes, bookId, notes) {
  return prisma.book.update({
    where: {
      id: bookId,
    },
    data: { totalRead, totalVolumes, notes },
    select: {
      id: true,
      title: true,
      totalRead: true,
      totalVolumes: true,
      notes: true,
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
      notes: true,
    },
  });
}

async function addCollection(userId, title, totalVolumes, totalRead, notes) {
  return prisma.book.create({
    data: {
      title,
      totalRead,
      totalVolumes,
      userId,
      notes,
    },
    select: {
      id: true,
      title: true,
      totalRead: true,
      totalVolumes: true,
      notes: true,
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
      notes: true,
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

async function updateBook(id, title, totalRead, totalVolumes, notes) {
  return prisma.book.update({
    where: {
      id,
    },
    data: {
      title,
      totalRead,
      totalVolumes,
      notes,
    },
    select: {
      id: true,
      title: true,
      totalRead: true,
      totalVolumes: true,
      notes: true,
    },
  });
}

export default {
  findUserById,
  findUserByUsername,
  getUserProfile,
  createUser,
  updateUsername,
  updatePassword,
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
  updateBook,
};
