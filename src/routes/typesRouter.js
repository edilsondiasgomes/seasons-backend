import express from "express";
import typesController from "../controllers/typesController.js";

const router = express.Router();

router.get("/", typesController.getAllTypes);

export default router;
