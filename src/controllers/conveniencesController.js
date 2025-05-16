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

// Seleciona as conveniencias da acomodação
export async function selectConveniencesAccommodationByID(accommodationId) {
    const query = `Select id, name FROM conveniences c inner join accommodation_conveniences ac on c.id = ac.convenience_id WHERE ac.accommodation_id = $1`;
    const values = [accommodationId];
    const result = await client.query(query, values);
    return result.rows;
}

// Insere as conveniencias da acomodação
export async function insertConveniencesToAccommodation(accommodationId, conveniences) {
    const queryConveniences = `INSERT INTO accommodation_conveniences(accommodation_id, convenience_id) VALUES ($1, $2)`;
    for (const convenience of conveniences) {
        await client.query(queryConveniences, [accommodationId, convenience.id]);
    }
}

// Seleciona o id da conveniencia e o id da acomodação 
export async function selectConveniencesByID(id) {
    const result = await client.query('SELECT * From accommodation_conveniences WHERE accommodation_id = $1', [id]);
    return result.rows;
}

export async function deleteConveniencesAccomodationByID(id) {
    const result = await client.query(`DELETE from accommodation_conveniences WHERE accommodation_id = $1`, [id])
    return result.rows
}

export async function deleteConveniencesByIDExcludedFront(accommodationID, conveniencesDataBase, conveniencesFront) {
    const conveniencesToDelete = conveniencesDataBase.filter(itemDataBase => !conveniencesFront.some(itemFront => itemFront.id === itemDataBase.convenience_id))
    const queryDeleteConveniences = `DELETE FROM accommodation_conveniences WHERE accommodation_id = $1 AND convenience_id = $2`;

    for (const convenience of conveniencesToDelete) {
        await client.query(queryDeleteConveniences, [accommodationID, convenience.convenience_id]);
    }
}

export async function insertConveniencesByIDAddedFront(accommodationID, conveniencesFront, conveniencesDataBase) {
    const conveniencesToAdd = conveniencesFront.filter(itemFront => !conveniencesDataBase.some(itemDataBase => itemDataBase.convenience_id === itemFront.id))
    const queryInsertConveniences = `INSERT INTO accommodation_conveniences(accommodation_id, convenience_id) VALUES ($1, $2)`;

    for (const convenience of conveniencesToAdd) {
        await client.query(queryInsertConveniences, [accommodationID, convenience.id]);
    }
}


export default {
    selectAllConveniences,
    insertConvenience,
    deleteConvenience,
    updateConvenience,
    selectConveniencesByID,
    insertConveniencesByIDAddedFront,
    deleteConveniencesByIDExcludedFront,
    insertConveniencesToAccommodation,
    selectConveniencesAccommodationByID,
    deleteConveniencesAccomodationByID
};