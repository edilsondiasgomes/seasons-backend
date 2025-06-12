import reservationsController from "../controllers/reservationController.js"

import express from "express";

const router = express.Router()

router.post("/", reservationsController.createReservation )

router.get("/", reservationsController.listReservations )

router.get("/user/:id", reservationsController.getReservationByUser )

router.get("/accommodation/:id", reservationsController.getReservationByAccommodation )

router.delete("/:id", reservationsController.deleteReservation )

export default router