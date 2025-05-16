const validate = (req, res, next) => {
  const { body } = req;
  if (body.id === undefined) {
    res.status(400).json({ message: "Id is required!" });
  }
  if (!body.id) {
    res.status(400).json({ message: "Id cannot be empty!" });
  }

  next();
};

export default { validate };
