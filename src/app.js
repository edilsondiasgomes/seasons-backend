import express from "express";
import router from "./routes/router.js";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ['https://rentals-frontend-nine.vercel.app','rentals-frontend-nine.vercel.app', 'http://localhost:4200', 'https://storage.googleapis.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    next(); 
  } else {
    express.json()(req, res, next);
  }
});
app.use(router);

export default app;
