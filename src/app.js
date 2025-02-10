import express from "express";
import router from "./routes/router.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use((req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    next(); // Ignorar express.json() para multipart/form-data
  } else {
    express.json()(req, res, next);
  }
});
app.use(router);

export default app;
