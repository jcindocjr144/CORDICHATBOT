import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import messagesRouter from "./routes/messages.js";
import autoResponsesRouter from "./routes/autoResponses.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/messages", messagesRouter);
app.use("/api/auto-responses", autoResponsesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
