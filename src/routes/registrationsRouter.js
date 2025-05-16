import express from "express";
import registrationsController from "../controllers/registrationsController.js";
import middleware from "../middleware/registrationValidate.js";

const router = express.Router();

router.get("/", registrationsController.getAllRegistrations);

router.get("/:id", registrationsController.getRegistrationById);

router.post("/login", registrationsController.doLogin);

router.post("/insert", registrationsController.insertRegister);
// router.post("/insert", middleware.validate, registrationsController.insertRegister);

router.delete("/:id", registrationsController.deleteRegister);

router.put("/update/:id", registrationsController.updateRegister);



export default router;
