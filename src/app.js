import express from "express";

const app = express();

const array = [
  { id: 1, nome: "Edilson", cidade: "Valinhos" },
  { id: 1, nome: "Eder", cidade: "Sumaré" },
  { id: 1, nome: "Dalton", cidade: "Vinhedo" },
];

app.get("/", (req, res) => {
  res.send("Hello world! Backend Node cantando");
});

app.get("/segundo", (req, res) => {
  res.status(200).send(array);
});

export default app;
