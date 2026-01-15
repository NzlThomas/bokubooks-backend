import bcrypt from "bcryptjs";
import db from "../db/queries.js";
import jwt from "jsonwebtoken";

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

async function postLogin(req, res) {
  try {
    const { username, password } = req.body;
    const user = await db.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "60min",
    });
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
}

export default { postRegister, postLogin };
