import express from "express";
import registrationsRouter from "./registrationsRouter.js";
import typesRouter from "./typesRouter.js"
import conveniencesRouter from "./conveniencesRouter.js"

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Seasons backend works!");
});

router.use("/registrations", registrationsRouter);
router.use("/types", typesRouter);
router.use("/conveniences", conveniencesRouter);

export default router;
