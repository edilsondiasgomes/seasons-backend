import express from "express";
import conveniencesController from "../controllers/conveniencesController.js";

const router = express.Router();

router.get("/", conveniencesController.getAllConveniences);

export default router