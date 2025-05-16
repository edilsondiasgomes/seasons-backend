import client from "./../database.js"

export const createReservation = async (req, res) => {

    try {
        const { accommodationId, userId, initialDate, finalDate, quantityDaily, amount, guests } = req.body
        const values = [accommodationId, userId, initialDate, finalDate, quantityDaily, amount, guests]

        const query = `INSERT INTO reservations (accommodation_id, user_id, initial_date, final_date, quantity_daily, amount, guests) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`

        const result = await client.query(query, values)
        const reservation = result.rows
        
        res.status(200).send(reservation)

    } catch (error) {
        res.status(400).send({message: 'Erro ao fazer a reserva!'})
    }

}

export default { createReservation }