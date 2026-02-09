import bcrypt from "bcryptjs";
import db from "../db/queries.js";
import jwt from "jsonwebtoken";

async function postRegister(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        error: "Username must be between 3 and 20 characters",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

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
    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
}

async function postLogout(req, res) {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.userId;

    const user = await db.getUserProfile(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user infos" });
  }
}

async function putUsername(req, res) {
  try {
    const userId = req.userId;
    const { newUsername } = req.body;

    if (!newUsername || newUsername.length < 3) {
      return res
        .status(400)
        .json({ error: "Username missing or below 3 characters." });
    }

    const isUsernameTaken = await db.findUserByUsername(newUsername);

    if (isUsernameTaken) {
      return res.status(409).send("Username taken");
    }

    const updatedUsername = await db.updateUsername(userId, newUsername);

    res
      .status(200)
      .json({ message: "Updated username successfully", updatedUsername });
  } catch (error) {
    res.status(500).json({ error: "Failed to update username" });
  }
}

async function putPassword(req, res) {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "PASSWORD_TOO_SHORT",
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await db.findUserById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ error: "USER_NOT_FOUND", message: "User not found" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(401).json({
        error: "INVALID_CURRENT_PASSWORD",
        message: "Invalid credentials",
      });
    }

    const isDifferent = await bcrypt.compare(newPassword, user.password);
    if (isDifferent) {
      return res.status(400).json({
        error: "SAME_PASSWORDS",
        message: "New password must be different from the old one",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.updatePassword(userId, hashedPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
}

export default {
  postRegister,
  postLogin,
  postLogout,
  getProfile,
  putUsername,
  putPassword,
};
