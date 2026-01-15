import bcrypt from "bcryptjs";
import db from "../db/queries.js";

async function postRegister(req, res) {
  try {
    const { username, password } = req.body;
    const existingUser = await db.findUserByUsername(username);

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(username, hashedPassword);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
}

export default { postRegister };
