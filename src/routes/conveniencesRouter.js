import express from "express";
import conveniencesController from "../controllers/conveniencesController.js";

const router = express.Router();

router.post("/", conveniencesController.insertConvenience);
router.get("/", conveniencesController.getAllConveniences);
router.put("/:id", conveniencesController.updateConvenience);
router.delete("/:id", conveniencesController.deleteConvenience);

export default router