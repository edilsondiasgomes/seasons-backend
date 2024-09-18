import express from "express";
import registrationsController from "../controllers/registrationsController.js";
import list from "../db.js";
import middleware from "../middleware/registrationValidate.js";

const router = express.Router();

router.get("/", registrationsController.getAllRegistrations);

router.get("/:id", registrationsController.getRegisterForID);

router.post("/insert", middleware.validate, registrationsController.insertRegister);

router.delete("/:id", registrationsController.deleteRegister);

router.put("/list/:id", (req, res) => {
  let index = buscarIndex(req.params.id);
  list[index].nome = req.body.nome;
  list[index].cidade = req.body.cidade;
  // res.send(`Item ${req.params.id} excluído com sucesso!`);
  res.json(list);
});

function buscarIndex(id) {
  return list.findIndex((item) => item.id == id);
}

export default router;
