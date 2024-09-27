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
        console.log(req.body);
        
        const { title, typeSelected, mainImage, street, number, complement, district, postalCode,
            city, uf, country, guestsAllowed, checkIn, checkOut, rooms, toilets, description, initialDate, finalDate,
            cleaningFee, dailyRate, conveniencesPlace
        } = req.body;

        const query = `INSERT INTO accommodations (title, typeSelected, mainImage, street, number, complement, district, postalCode,
            city, uf, country, guestsAllowed, checkIn, checkOut, rooms, toilets, description, initialDate, finalDate,
            cleaningFee, dailyRate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            RETURNING id`;

        const values = [title, typeSelected.id, mainImage ? mainImage.objectURL.changingThisBreaksApplicationSecurity : null,
            street, number, complement, district, postalCode, city, uf, country, guestsAllowed, checkIn, checkOut,
            rooms, toilets, description, initialDate, finalDate, cleaningFee, dailyRate];

        const result = await client.query(query, values);
        
        const accommodationId = result.rows[0].id;

        res.status(200).send(data);

    } catch (error) {
        res.status(500).send('Erro ao gravar dados')
    }
}

export default { getAllAccommodations, insertAccommodation };