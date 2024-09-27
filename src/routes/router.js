import express from "express";
import accommodationsRouter from "./accommodationsRouter.js";
import registrationsRouter from "./registrationsRouter.js";
import typesRouter from "./typesRouter.js"
import conveniencesRouter from "./conveniencesRouter.js"

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Seasons backend works!");
});

router.use("/accommodations", accommodationsRouter);
router.use("/registrations", registrationsRouter);
router.use("/types", typesRouter);
router.use("/conveniences", conveniencesRouter);

export default router;
