import "dotenv/config";
import cors from "cors";

import express from "express";
const app = express();

import router from "./routes/trackerRouter.js";

const PORT = process.env.EXPRESS_PORT;

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server is listening on http://localhost:${PORT}`);
});
