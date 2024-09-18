import list from "./../db.js";

export const getAllRegistrations = (req, res) => {
  return res.status(200).send(list);
};

export const insertRegister = (req, res) => {
  list.push(req.body);
  return res.status(200).send(list);
};

export const getRegisterForID = (req, res) => {
  const id = req.params.id;
  const register = findRegisterForID(id);

  if (register) {
    return res.status(200).json(register);
  } else {
    res
      .status(404)
      .json({ message: "Não existem registros para essa consulta!" });
  }
};

export const deleteRegister = (req, res) => {
  let index = findIndexRegister(req.params.id);
  console.log(index);
  list.splice(index, 1);
  res.status(200).json({ message: "Registro excluído com sucesso!" });
};

function findRegisterForID(id) {
  return list.find((item) => item.id == id);
}

function findIndexRegister(id) {
  return list.findIndex((item) => item.id == id);
}

export default {
  getAllRegistrations,
  insertRegister,
  getRegisterForID,
  deleteRegister,
};
