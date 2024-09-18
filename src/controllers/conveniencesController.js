import client from "./../database.js";

export const getAllConveniences = async (req, res) => {
    try {
        const result = await client.query('Select * from conveniences');
        const data = result.rows;
        res.status(200).send(data);

    } catch (error) {
        res.status(500).send('Erro ao buscar dados!')

    }
}

export default { getAllConveniences };