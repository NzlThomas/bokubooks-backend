import db from "../db/queries.js";

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

export default { postWishlist };
