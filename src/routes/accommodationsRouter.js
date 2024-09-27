import express from "express";
import accommodationsController from "../controllers/accommodationsController.js";

const router = express.Router();

router.get("/", accommodationsController.getAllAccommodations);
router.post("/", accommodationsController.insertAccommodation);

export default router;
