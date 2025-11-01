import express from "express";
import pool from "../dbconfig.js";

const router = express.Router();

// 🟢 Fetch all users
router.get("/", async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, role, last_activity, created_at FROM users ORDER BY id ASC"
    );
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// 🟡 Update user info
router.put("/:id", async (req, res) => {
  const { username, password, role } = req.body;
  const { id } = req.params;

  if (!username || !role) {
    return res.status(400).json({ message: "Missing username or role" });
  }

  try {
    let query, params;

    if (password && password.trim() !== "") {
      query = "UPDATE users SET username=?, password=?, role=? WHERE id=?";
      params = [username, password, role, id];
    } else {
      query = "UPDATE users SET username=?, role=? WHERE id=?";
      params = [username, role, id];
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// 🔴 Delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id=?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// 🟢 Update user activity timestamp
router.put("/:id/activity", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE users SET last_activity = NOW() WHERE id = ?", [id]);
    res.json({ message: "User activity updated" });
  } catch (err) {
    console.error("Error updating activity:", err);
    res.status(500).json({ message: "Failed to update activity" });
  }
});

// 🟢 Fetch all other users (for contact list)
router.get("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await pool.query(
      "SELECT id, username, role, last_activity FROM users WHERE id != ? ORDER BY username ASC",
      [id]
    );
    res.json(users);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

// 🟢 Fetch chat messages between two users
router.get("/messages/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const [messages] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY timestamp ASC`,
      [senderId, receiverId, receiverId, senderId]
    );
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// 🟢 Send message
router.post("/messages", async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ message: "Missing message data" });
  }

  try {
    await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, NOW())",
      [sender_id, receiver_id, message]
    );
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
