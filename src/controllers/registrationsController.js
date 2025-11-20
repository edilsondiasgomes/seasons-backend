import client from "./../database.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

// RegistrationController

export const getAllRegistrations = async (req, res) => {
  try {
    const query = `SELECT * FROM registrations`
    const result = await client.query(query)
    const registrations = result.rows

    res.status(200).send(registrations)

  } catch (error) {
    res.status(500).send('Erro ao buscar registros!')
  }

};

export const getNameRegistrationById = async (req, res) =>{
  try {
    const id = req.body
    const query = `SELECT name FROM registrations WHERE id = $1`
    const result = await client.query(query, [id])
    const name = result.rows
    console.log(name);
        
  } catch (error) {
    res.status(400).send('Usuário não encontrato!')
  }

}

export const getRegistrationById = async (req, res) => {
  try {
    const id = req.params.id
    const query = `SELECT id, cpf, street, number, complement, district, "postalCode", city, uf, name, birthday, email FROM registrations WHERE id = $1`
    const result = await client.query(query, [id])
    const registration = result.rows[0]
    res.status(200).send(registration)

  } catch (error) {
    res.status(400).send('Usuário não encontrato!')

  }

}

export const insertRegister = async (req, res) => {
  try {
    const { cpf, street, number, complement, district, postalCode, city, uf, name, email, password, birthday } = req.body
    const passwordHashed = await bcrypt.hash(password, 10)
    const queryRegistration = `
      INSERT INTO registrations (cpf, street, number, complement, district, "postalCode", city, uf, name, email, password, birthday) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ) RETURNING *`
    const values = [cpf, street, number, complement, district, postalCode, city, uf, name, email, passwordHashed, birthday]

    const result = await client.query(queryRegistration, values)
    const registration = result.rows

    res.status(200).send(registration)

  } catch (error) {
    res.status(500).send('Erro ao salvar registro')
    console.log(error);
  }

};

export const doLogin = async (req, res) => {

  const { email, password } = req.body;
  const query = `SELECT * FROM registrations where email = $1`;
  const result = await client.query(query, [email])
  const user = result.rows[0];

  if (!user) {
    return res.status(400).json({message:'Usuário não cadastrado!'});
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return res.status(400).send('Senha inválida!')
  }

  const token = jwt.sign({ userId: user.id, userName: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' }
  );

  return res.status(200).json({ access_token: token })

};

export const deleteRegister = async (req, res) => {

  try {
    const id = req.params.id
    const query = `DELETE FROM registrations WHERE id = $1`
    const result = await client.query(query, [id])

    if (result.rowCount === 0) {
      return res.send('Registro não encontrado')
    }
    res.status(200).json({ message: "Registro excluído com sucesso!" });

  } catch (error) {
    res.status(500).send('Erro ao excluir registro!')

  }
}

export const updateRegister = async (req, res) => {
  
  try {
    const { id, cpf, street, number, complement, district, postalCode, city, uf, name, email, password, birthday } = req.body
    const passwordHashed = await bcrypt.hash(password, 10)
    const query = `UPDATE registrations SET 
    cpf = $1,
    street = $2,
    number = $3,
    complement = $4,
    district = $5,
    "postalCode" = $6,
    city = $7,
    uf = $8,
    name = $9,
    email = $10,
    password = $11,
    birthday = $12
  
    WHERE id = $13
    `
    const values = [cpf, street, number, complement, district, postalCode, city, uf, name, email, passwordHashed, birthday, id]
    const result = await client.query(query, values)
    const user = result.rows[0];

    res.status(200).send(user)

  } catch (error) {
    res.status(500).send({ message: 'Erro ao editar dados!' })

  }

}

export default {
  getAllRegistrations,
  insertRegister,
  doLogin,
  deleteRegister,
  updateRegister,
  getRegistrationById
};
