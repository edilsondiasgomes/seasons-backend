import client from "./../database.js";

export const getAllAccommodations = async (req, res) => {
    try {
        const result = await client.query(`Select * FROM accommodations`);
        const data = result.rows;
        res.status(200).send(data);

    } catch (error) {
        res.status(500).send('Erro ao buscar dados');
    }
}

export const insertAccommodation = async (req, res) => {
    try {
        const { id, title, typeSelected, mainImage, street, houseNumber, complement, district, postalCode,
            city, uf, country, guestsAllowed, checkIn, checkOut, rooms, toilets, description, conveniencesPlace, initialDate, finalDate,
            cleaningFee, dailyRate } = req.body

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

        const queryConveniences = `INSERT INTO accommodation_conveniences(accommodation_id, convenience_id) VALUES ($1, $2)`;

        for (const convenience of conveniencesPlace) {
            await client.query(queryConveniences, [accommodationId, convenience.id]);
        }

        res.status(200).send(accommodation);

    } catch (error) {
        console.log(req);
        console.log(error);
        res.status(500).send('Erro ao salvar acomodação!')
    }
}

export const updateAccommodation = async (req, res) => {
    try {
        const { title, typeSelected, mainImage, street, houseNumber, complement, district, postalCode,
            city, uf, country, guestsAllowed, checkIn, checkOut, rooms, toilets, description, initialDate, finalDate,
            cleaningFee, dailyRate } = req.body

        const { id } = req.params

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
        res.status(200).send(accommodation);

    } catch (error) {
        console.log(error);

        res.status(500).send('Erro ao editar acomodação!')
    }
}

export const deleteAccommodation = async (req, res) => {
    console.log(req.body);

    try {
        const { id } = req.params;
        const query = `DELETE FROM accommodations WHERE id = $1`
        const values = [id]

        const result = await client.query(query, values)

        if (result.rowCount === 0) {
            return res.send('Acomodação não encontrada!')
        }

        res.status(200).json({ message: 'Acomodação excluída com sucesso!' });

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

export default { getAllAccommodations, insertAccommodation, updateAccommodation, deleteAccommodation };