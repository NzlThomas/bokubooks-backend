import db from "../db/queries.js";

async function getWishlist(req, res) {
  try {
    const userId = req.userId;

    const wishlist = await db.findUserWishlist(userId);

    res.status(200).json({ message: wishlist });
  } catch (error) {
    res.status(500).json({ error: "Couldn't retrieve User Wishlist" });
  }
}

async function postWishlist(req, res) {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Book title is required" });
    }

    const wishlistVerification = await db.findWishlist(userId, title);

    if (wishlistVerification) {
      return res
        .status(409)
        .json({ error: "This book is already in the wishlist" });
    }

    const newBook = await db.addWishlist(userId, title);

    res.status(201).json({ message: "Book added to wishlist", newBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to create entry in wishlist" });
  }
}

async function deleteWishlist(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Book ID required" });
    }

    const findBook = await db.findWishlistById(id);

    if (!findBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (findBook.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    await db.deleteWishlist(id);

    res.json({ deletedBook: { id: findBook.id, title: findBook.title } });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete entry from wishlist" });
  }
}

export default { postWishlist, deleteWishlist, getWishlist };
