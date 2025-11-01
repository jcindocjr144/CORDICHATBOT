import express from "express";
import db from "../dbconfig.js";

const router = express.Router();

const getAdminId = async () => {
  const [admins] = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (admins.length === 0) throw new Error("No admin found");
  return admins[0].id;
};

router.post("/send", async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    if (!sender_id || !message?.trim()) {
      return res.status(400).json({ success: false, error: "Missing sender or message" });
    }

    const adminId = await getAdminId();
    const toId = receiver_id || adminId;

    const sql = `
      INSERT INTO messages (sender_id, receiver_id, message, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [sender_id, toId, message.trim()]);

    if (sender_id !== adminId) {
      const [matches] = await db.query(
        "SELECT response FROM auto_responses WHERE ? LIKE CONCAT('%', question, '%') LIMIT 1",
        [message.trim()]
      );

      if (matches.length > 0) {
        const reply = matches[0].response;
        if (reply && reply.trim() !== "") {
          await db.query(
            "INSERT INTO messages (sender_id, receiver_id, message, created_at) VALUES (?, ?, ?, NOW())",
            [adminId, sender_id, reply.trim()]
          );
        }
      }
    }

    res.json({ success: true, id: result.insertId, message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ success: false, error: "Database insert failed" });
  }
});

router.get("/fetchMessages", async (req, res) => {
  try {
    const { sender_id } = req.query;
    if (!sender_id) {
      return res.status(400).json({ success: false, error: "Missing sender ID" });
    }

    const adminId = await getAdminId();
    const sql = `
      SELECT * FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `;
    const [results] = await db.query(sql, [sender_id, adminId, adminId, sender_id]);

    res.json({ success: true, messages: results });
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ success: false, error: "Failed to fetch conversation" });
  }
});

router.get("/autoResponses", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM auto_responses");
    res.json(results);
  } catch (err) {
    console.error("Error fetching auto responses:", err);
    res.status(500).json({ success: false, error: "Failed to fetch auto responses" });
  }
});

router.get("/fetchAll", async (req, res) => {
  try {
    const { sender_id } = req.query;
    if (!sender_id) return res.status(400).json({ success: false, error: "Missing sender ID" });

    const adminId = await getAdminId();
    const [messages] = await db.query(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [sender_id, adminId, adminId, sender_id]
    );
    const [autoResponses] = await db.query("SELECT * FROM auto_responses");

    res.json({ success: true, messages, autoResponses });
  } catch (err) {
    console.error("Error fetching combined data:", err);
    res.status(500).json({ success: false, error: "Failed to fetch data" });
  }
});

export default router;
