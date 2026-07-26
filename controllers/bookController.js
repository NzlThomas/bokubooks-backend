import db from "../db/queries.js";

async function getWishlist(req, res) {
  try {
    const userId = req.userId;

    const wishlist = await db.findUserWishlist(userId);

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ error: "Couldn't retrieve User Wishlist." });
  }
}

async function postWishlist(req, res) {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Book title is required." });
    }

    const wishlistVerification = await db.findWishlist(userId, title);

    if (wishlistVerification) {
      return res.status(409).json({
        error: "ALREADY_IN_WISHLIST",
        message: "This book is already in your wishlist.",
      });
    }

    const collectionVerification = await db.findCollection(userId, title);

    if (collectionVerification) {
      return res.status(409).json({
        error: "ALREADY_IN_COLLECTION",
        message: "This book is already in your collection.",
      });
    }

    const newBook = await db.addWishlist(userId, title);

    res.status(201).json({ message: "Book added to wishlist.", newBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to create entry in wishlist." });
  }
}

async function deleteWishlist(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Book ID required." });
    }

    const findBook = await db.findWishlistById(id);

    if (!findBook) {
      return res.status(404).json({ error: "Book not found." });
    }

    if (findBook.userId !== userId) {
      return res.status(403).json({ error: "Access denied." });
    }

    await db.deleteWishlist(id);

    res
      .status(200)
      .json({ deletedBook: { id: findBook.id, title: findBook.title } });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete entry from wishlist." });
  }
}

async function getCollection(req, res) {
  try {
    const userId = req.userId;

    const collection = await db.findUserCollection(userId);

    res.status(200).json({ collection });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user collection." });
  }
}

async function postCollection(req, res) {
  try {
    const userId = req.userId;
    const { title, totalRead, totalVolumes, notes, readingStatus } = req.body;

    if (
      !title ||
      totalRead === undefined ||
      totalVolumes === undefined ||
      !readingStatus
    ) {
      return res.status(400).json({
        error:
          "Missing Book title, volumes read/volumes owned or reading status.",
      });
    }

    if (totalRead < 0 || totalVolumes < 0) {
      return res.status(400).json({
        error: "Values cannot be inferior to 0",
      });
    }

    if (totalVolumes === 0) {
      return res.status(400).json({
        error:
          "You must own at least 1 volume to add a book to your collection.",
      });
    }

    if (totalRead > totalVolumes) {
      return res.status(400).json({
        error: "Read volumes cannot be superior to owned volumes.",
      });
    }

    const isAlreadyAdded = await db.isAlreadyAdded(title, userId);

    if (isAlreadyAdded) {
      return res
        .status(409)
        .json({ error: "This book is already in the collection." });
    }

    const isInWishlist = await db.findWishlist(userId, title);

    if (isInWishlist) {
      const updateWishlist = await db.updateWishlist(
        totalRead,
        totalVolumes,
        isInWishlist.id,
        notes,
        readingStatus,
      );
      return res.status(201).json({
        message: "Booked moved from wishlist to collection",
        updatedBook: updateWishlist,
      });
    }

    const newBook = await db.addCollection(
      userId,
      title,
      totalVolumes,
      totalRead,
      notes,
      readingStatus,
    );

    res.status(201).json({ message: "Book added successfully.", newBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book to collection." });
  }
}

async function deleteCollection(req, res) {
  try {
    const userId = req.userId;

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Book ID required." });
    }

    const findBook = await db.findCollectionById(id);

    if (!findBook) {
      return res.status(404).json({ error: "Book not found." });
    }

    if (findBook.userId !== userId) {
      return res.status(403).json({ error: "Access denied." });
    }

    await db.removeCollection(id);

    res
      .status(200)
      .json({ deletedBook: { id: findBook.id, title: findBook.title } });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete entry from collection." });
  }
}

async function putCollection(req, res) {
  try {
    const userId = req.userId;
    const { id, title, totalRead, totalVolumes, notes, readingStatus } =
      req.body;

    if (
      !title ||
      totalRead === undefined ||
      totalVolumes === undefined ||
      !readingStatus
    ) {
      return res.status(400).json({
        error:
          "Missing Book title, volumes read/volumes owned or reading status.",
      });
    }

    if (totalRead < 0 || totalVolumes < 0) {
      return res.status(400).json({
        error: "Values cannot be inferior to 0",
      });
    }

    if (totalVolumes === 0) {
      return res.status(400).json({
        error:
          "You must own at least 1 volume to add a book to your collection.",
      });
    }

    if (totalRead > totalVolumes) {
      return res.status(400).json({
        error: "Read volumes cannot be superior to owned volumes.",
      });
    }

    const book = await db.findCollectionById(id);

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    if (book.userId !== userId) {
      return res.status(403).json({ error: "Access denied." });
    }

    const updatedBook = await db.updateBook(
      id,
      title,
      totalRead,
      totalVolumes,
      notes,
      readingStatus,
    );

    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
}

async function getUserStats(req, res) {
  try {
    const userId = req.userId;

    const collection = await db.findUserCollection(userId);

    const totalSeries = collection.length;

    const ownedSum = collection.reduce(
      (sum, book) => sum + (book.totalVolumes || 0),
      0,
    );

    const readSum = collection.reduce((sum, book) => sum + book.totalRead, 0);

    const stats = {
      totalSeries,
      ownedSum,
      readSum,
    };

    res.status(200).json({
      message: "Stats acquired successfully",
      stats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve user statistics.",
    });
  }
}

export default {
  postWishlist,
  deleteWishlist,
  getWishlist,
  getCollection,
  postCollection,
  deleteCollection,
  putCollection,
  getUserStats,
};
