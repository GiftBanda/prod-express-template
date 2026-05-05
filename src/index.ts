import express from "express";

const app = express();
const PORT = process.env.PORT ?? 9001;

app.get("/", (_req, res) => {
  res.send("Hello, World!");
  console.log("Response sent to client");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${String(PORT)}`);
});
