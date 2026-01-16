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

async function addWishlist(userId, title) {
  return prisma.book.create({
    data: { userId, title },
  });
}

export default { findUserByUsername, createUser, findWishlist, addWishlist };
