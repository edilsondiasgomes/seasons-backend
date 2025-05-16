import reservationsController from "../controllers/reservationController.js"

import express from "express";

const router = express.Router()

router.post("/", reservationsController.createReservation )

export default router