import express from "express";
import accommodationsController from "../controllers/accommodationsController.js";
import upload from "../middleware/multer.config.js";
import { uploadFiles, deleteAllFiles } from "../services/firebase.service.js";
import verifyToken from "../middleware/verifyToken.js";


const router = express.Router();

// Lista as acomodações
router.get("/", accommodationsController.getAllAccommodations);

// Cria uma acomodação
router.post("/", upload.array('files'), uploadFiles, accommodationsController.insertAccommodation)

// Edita uma acomodação
router.put("/:id", upload.array('files'), uploadFiles, accommodationsController.updateAccommodation);

// Exclui uma acomodação
router.put("/delete/:id", deleteAllFiles, accommodationsController.deleteAccommodation);

export default router;
