import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log(`hello, world!`);
});

app.listen(process.env.PORT, (error) => {
  if (error) return;
  console.log(`server running on: http://localhost:${process.env.PORT}`);
});
