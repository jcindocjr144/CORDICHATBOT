import express from "express";
import db from "../dbconfig.js";
import getUser from "../middleware/getUser.js";

const router = express.Router();

// Send message
router.post("/send", getUser, async (req, res) => {
  const { message, receiver_id } = req.body; // <-- include receiver_id from frontend
  const user = req.user; // logged-in user

  if (!message) {
    return res.status(400).json({ success: false, message: "Message cannot be empty" });
  }

  try {
    let receiverId;

    if (user.role === "admin") {
      // Admin must provide receiver_id
      if (!receiver_id) {
        return res.status(400).json({ success: false, message: "Receiver ID is required for admin" });
      }
      receiverId = receiver_id;
    } else {
      // For students, get first admin as receiver
      const [admins] = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
      if (admins.length === 0) {
        return res.status(404).json({ success: false, message: "No admin found" });
      }
      receiverId = admins[0].id;
    }

    // Insert message into DB
    const [result] = await db.query(
      "INSERT INTO messages (sender_id, receiver_id, message, created_at, timestamp) VALUES (?, ?, ?, NOW(), NOW())",
      [user.id, receiverId, message]
    );

    // Check for auto-response
    const [autoReply] = await db.query(
      "SELECT response FROM auto_responses WHERE question = ? LIMIT 1",
      [message]
    );

    if (autoReply.length > 0 && autoReply[0].response) {
      await db.query(
        "INSERT INTO messages (sender_id, receiver_id, message, created_at, timestamp) VALUES (?, ?, ?, NOW(), NOW())",
        [receiverId, user.id, autoReply[0].response]
      );
    }

    res.json({ success: true, message: "Message sent", id: result.insertId, sender_id: user.id, receiver_id: receiverId });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch messages for a user
router.get("/fetchMessages", async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ success: false, message: "Missing user ID" });

  try {
    const [messages] = await db.query(
      "SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY timestamp ASC",
      [userId, userId]
    );
    res.json({ success: true, messages });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch auto-response questions
router.get("/autoResponses", async (req, res) => {
  try {
    const [responses] = await db.query("SELECT id, question FROM auto_responses");
    res.json(responses);
  } catch (err) {
    console.error("Auto responses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
