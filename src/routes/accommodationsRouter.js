import express from "express";
import accommodationsController from "../controllers/accommodationsController.js";
import upload from "../middleware/multer.config.js";
import { uploadFile, deleteFile } from "../services/firebase.service.js";

const router = express.Router();

router.get("/", accommodationsController.getAllAccommodations);

router.post("/", upload.array('files'), uploadFile, accommodationsController.insertAccommodation)

router.delete("/image", deleteFile)

router.put("/:id", accommodationsController.updateAccommodation);

router.delete("/:id", accommodationsController.deleteAccommodation);

export default router;
