import express from "express";
import accommodationsController from "../controllers/accommodationsController.js";


const router = express.Router();

router.get("/", accommodationsController.getAllAccommodations);
router.post("/", accommodationsController.insertAccommodation);
router.put("/:id", accommodationsController.updateAccommodation);
router.delete("/:id", accommodationsController.deleteAccommodation);


export default router;
