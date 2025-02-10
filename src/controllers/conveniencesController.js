import client from "./../database.js";

export const selectAllConveniences = async (req, res) => {
    try {
        const result = await client.query('SELECT * from conveniences');
        const data = result.rows;
        res.status(200).send(data);

    } catch (error) {
        res.status(500).send('Erro ao buscar dados!')
    }
}

export const insertConvenience = async (req, res) => {
    try {
        const { name } = req.body
        const query = `INSERT INTO conveniences (name) VALUES ($1) RETURNING *`;
        const values = [name];

        const result = await client.query(query, values)
        const data = result.rows[0];
        res.status(201).send(data);

    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao salvar conveniencia!')
    }
}

export const deleteConvenience = async (req, res) => {
    try {
        const { id } = req.params
        const query = `DELETE FROM conveniences WHERE id = $1 RETURNING *`;
        const values = [id];
        const result = await client.query(query, values);
        res.status(200).send('Conveniencia excluída com sucesso!')

    } catch (error) {
        res.status(500).send('Erro ao excluir conveniencia')
    }
}

export const updateConvenience = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const query = `UPDATE conveniences SET name = $1 WHERE id = $2 RETURNING *`
        const values = [name, id];
        const result = await client.query(query, values);
        res.status(200).send('Conveniencia editada com sucesso!')

    } catch (error) {
        res.status(500).send('Erro ao editar conveniencia!')
    }
}

export async function selectConveniencesByID(id) {
    const result2 = await client.query('SELECT * From accommodation_conveniences WHERE accommodation_id = $1', [id]);
    return result2.rows;
}

export async function deleteConveniencesExcludedByID(accommodationID, conveniencesDataBase, conveniencesFront) {
    const conveniencesToDelete = conveniencesDataBase.filter(itemDataBase => !conveniencesFront.some(itemFront => itemFront.id === itemDataBase.convenience_id))
    const queryDeleteConveniences = `DELETE FROM accommodation_conveniences WHERE accommodation_id = $1 AND convenience_id = $2`;

    for (const convenience of conveniencesToDelete) {
        await client.query(queryDeleteConveniences, [accommodationID, convenience.convenience_id]);
    }
}

export async function insertConveniencesAddedByID(accommodationID, conveniencesFront, conveniencesDataBase) {
    const conveniencesToAdd = conveniencesFront.filter(itemFront => !conveniencesDataBase.some(itemDataBase => itemDataBase.convenience_id === itemFront.id))
    const queryInsertConveniences = `INSERT INTO accommodation_conveniences(accommodation_id, convenience_id) VALUES ($1, $2)`;

    for (const convenience of conveniencesToAdd) {
        await client.query(queryInsertConveniences, [accommodationID, convenience.id]);
    }
}





export default { selectAllConveniences, insertConvenience, deleteConvenience, updateConvenience, selectConveniencesByID, insertConveniencesAddedByID, deleteConveniencesExcludedByID };