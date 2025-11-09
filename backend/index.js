import express from "express";
import cors from "cors";
import messagesRouter from "./routes/messages.js";
import autoResponsesRouter from "./routes/autoResponses.js";
import userMessagesRouter from "./routes/userMessages.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/messages", messagesRouter);
app.use("/api/auto-responses", autoResponsesRouter);
app.use("/api/userMessages", userMessagesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
