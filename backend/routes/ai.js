import express from "express";
import mysql from "mysql2";

const router = express.Router();
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatbotdb",
});

router.post("/reply", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Missing message" });
  db.query("SELECT response FROM auto_responses WHERE question=? LIMIT 1", [message], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.json({ response: "I don't know the answer yet." });
    res.json({ response: result[0].response });
  });
});

export default router;
