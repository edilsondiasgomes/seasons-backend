import client from "./../database.js";
import conveniencesController from "../controllers/conveniencesController.js";
import filesController from "../controllers/filesController.js";

export const getAllAccommodations = async (req, res) => {
    const { city, initialDate, finalDate, guestsAllowed, id } = req.query

    let values = [];
    let condition = [];

    if (id) {
        values.push(id)
        condition.push(`id=$${values.length}`)
    }
    if (city) {
        values.push(city)
        condition.push(`city=$${values.length}`)
    }
    if (initialDate) {
        values.push(initialDate)
        condition.push(`"initialDate"=$${values.length}`)
    }
    if (finalDate) {
        values.push(finalDate)
        condition.push(`"finalDate"=$${values.length}`)
    }
    if (guestsAllowed) {
        values.push(guestsAllowed)
        condition.push(`"guestsAllowed"=$${values.length}`)
    }

    let query = 'Select * FROM accommodations';

    if (values.length > 0) {
        query += ` WHERE ${condition.join(' AND ')}`
    }

    try {
        const result = await client.query(query, values);
        const resultAccommodations = result.rows;
        const accommodations = []

        for (const accommodation of resultAccommodations) {

            const { id } = accommodation
            let accommodationWithConveniences = [];

            try {
                // Buscar as conveniencias da acomodação
                const conveniencesPlace = await conveniencesController.selectConveniencesAccommodationByID(id)
                accommodationWithConveniences = { ...accommodation, conveniencesPlace }

            } catch (error) {
                res.status(500).send('Erro ao buscar as conveniencias da acomodação!');
                console.log(error);
            }

            try {
                // Buscar as imagens da acomodação
                const files = await filesController.getFilesAccommodation(id)
                const accommodationsWithFiles = { ...accommodationWithConveniences, files }
                accommodations.push(accommodationsWithFiles);

            } catch (error) {
                res.status(500).send('Erro ao buscar imagens da acomodação!');
                console.log(error);
            }
        }

        res.status(200).send(accommodations);

    } catch (error) {
        res.status(500).send('Erro ao buscar dados');
        console.log(error);
    }
}

export const getAccommodationBy = async (req, res) => {
    const params = req.params
    console.log(params);

    const query = `SELECT * FROM accommodations WHERE city = $1`

}

export const insertAccommodation = async (req, res) => {
    try {
        const { title, typeSelected, mainImage, street, houseNumber, complement, district, postalCode,
            city, uf, country, guestsAllowed, checkIn, checkOut, rooms, toilets, description, conveniencesPlace, initialDate, finalDate,
            cleaningFee, dailyRate } = req.body

        const conveniences = JSON.parse(conveniencesPlace);

        const queryAccommodation = `INSERT INTO accommodations (title, "typeSelected", "mainImage", street, "houseNumber", complement, district, "postalCode",
            city, uf, country, "guestsAllowed", "checkIn", "checkOut", rooms, toilets, description, "initialDate", "finalDate",
            "cleaningFee", "dailyRate") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            RETURNING *`;

        const values = [title, typeSelected, mainImage,
            street, houseNumber, complement, district, postalCode, city, uf, country, guestsAllowed, checkIn, checkOut,
            rooms, toilets, description, initialDate, finalDate, cleaningFee, dailyRate];

        const result = await client.query(queryAccommodation, values);
        const accommodation = result.rows[0];
        const accommodationId = accommodation.id;

        try {
            // Salvar conveniencias da acomodação
            await conveniencesController.insertConveniencesToAccommodation(accommodationId, conveniences)

        } catch (error) {
            res.status(500).send('Erro ao salvar conveniencia!')
            console.log(error);
        }

        try {
            // Salvar imagens da acomodação
            await filesController.insertFilesAccommodation(accommodationId, req.files)

        } catch (error) {
            res.status(500).send('Erro ao salvar imagens!')
            console.log(error);
        }

        res.status(200).send(accommodation);

    } catch (error) {
        res.status(500).send('Erro ao salvar acomodação!')
        console.log(error);
    }
}

export const updateAccommodation = async (req, res) => {
    try {
        const { title, typeSelected, mainImage, street, houseNumber, complement, district, postalCode,
            city, uf, country, guestsAllowed, checkIn, checkOut, rooms, toilets, description, files, conveniencesPlace, initialDate, finalDate,
            cleaningFee, dailyRate } = req.body

        const { id } = req.params;
        const conveniences = JSON.parse(conveniencesPlace);

        const query = `UPDATE accommodations SET 
        title = $1,
        "typeSelected" = $2,
        "mainImage" = $3, 
        street = $4, 
        "houseNumber" = $5, 
        complement = $6, 
        district = $7,
        "postalCode" = $8, 
        city = $9, 
        uf = $10, 
        country = $11, 
        "guestsAllowed" = $12, 
        "checkIn" = $13, 
        "checkOut" = $14, 
        rooms = $15, 
        toilets = $16, 
        description = $17, 
        "initialDate" = $18, 
        "finalDate" = $19, 
        "cleaningFee" = $20, 
        "dailyRate" = $21 
        WHERE id = $22 RETURNING *`

        const values = [title, typeSelected, mainImage,
            street, houseNumber, complement, district, postalCode, city, uf, country, guestsAllowed, checkIn, checkOut,
            rooms, toilets, description, initialDate, finalDate, cleaningFee, dailyRate, id];

        const result = await client.query(query, values)
        const accommodation = result.rows[0];

        // CONVENIENCIAS //////////////////////////////////

        // Conveniencias que vieram do front
        const conveniencesFront = conveniences

        // Conveniencias do banco de dados
        const conveniencesDataBase = await conveniencesController.selectConveniencesByID(id)

        // Compara as conveniencias. Excluiu no front, excluir do banco
        await conveniencesController.deleteConveniencesByIDExcludedFront(id, conveniencesDataBase, conveniencesFront)

        // Compara as conveniencias. Inseriu no front, inserir no banco
        await conveniencesController.insertConveniencesByIDAddedFront(id, conveniencesFront, conveniencesDataBase)

        // IMAGENS ///////////////////////////////////////

        // Imagens do front
        const filesFront = Array.isArray(files) ? files.map(item => JSON.parse(item)) : (files ? [JSON.parse(files)] : []);

        // Imagens do banco de dados
        const filesDataBase = await filesController.getFilesAccommodation(id)

        // Compara as imagens. Excluiu do front, excluir do banco.
        try {
            await filesController.deleteFilesExcludedFront(id, filesDataBase, filesFront)

        } catch (error) {
            res.status(500).send('Erro ao excluir imagens!')
            console.log(error);
        }

        // Adiciona imagens novas no banco
        try {
            await filesController.insertFilesAccommodation(id, req.files)

        } catch (error) {
            res.status(500).send('Erro ao salvar imagens!')
            console.log(error);
        }
        // FIM IMAGENS ///////////////////////////////////////

        res.status(200).send(accommodation);

    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao editar acomodação!')
    }
}

export const deleteAccommodation = async (req, res) => {
    const { id } = req.params;

    const result = await client.query(`SELECT * FROM reservations WHERE accommodation_id=$1`, [id])

    if (result.rowCount > 0) {
        return res.status(200).json({ message: 'Acomodação não pode ser excluída pois há reservas!' })
    }

    try {
        const result = await client.query(`DELETE FROM accommodations WHERE id = $1`, [id])

        if (result.rowCount === 0) {
            return res.send('Acomodação não encontrada!')
        }
        try {
            await filesController.deleteFilesAccomodationByID(id)
            return res.status(200).json({ message: 'Acomodação excluída com sucesso!' });

        } catch (error) {
            console.log(error);
            return res.status(500).send(error)

        }

    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

export default { getAllAccommodations, insertAccommodation, updateAccommodation, deleteAccommodation };