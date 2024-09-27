import client from "./../database.js";

export const getAllConveniences = async (req, res) => {
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

// UPDATE public.conveniences
// 	SET id=?, name=?
// 	WHERE <condition>;

//     router.put("/list/:id", (req, res) => {
//         let index = buscarIndex(req.params.id);
//         list[index].nome = req.body.nome;
//         list[index].cidade = req.body.cidade;
// }

export default { getAllConveniences, insertConvenience, deleteConvenience, updateConvenience };