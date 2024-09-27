import client from "./../database.js";

export const getAllTypes = async (req, res) => {
    try {
        const result = await client.query(`Select * FROM type_accommodation`);
        const data = result.rows;
        res.status(200).send(data)

    } catch (error) {
        res.status(500).send('Erro ao buscar dados')
    }
}

export default { getAllTypes };