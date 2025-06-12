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
        res.status(400).send({ message: 'Erro ao fazer a reserva!' })
    }
}

function setDataReservation(item) {
    return {
        registrationId: item.id,
        accommodationId: item.accommodation_id,
        userId: item.user_id,
        initialDate: item.initial_date,
        finalDate: item.final_date,
        quantityDaily: item.quantity_daily,
        amount: item.amount,
        guests: item.guests,
    }
}

export const listReservations = async (req, res) => {

    const query = `SELECT * FROM reservations`
    const result = await client.query(query)
    const reservations = result.rows

    const r = reservations.map(item => {
        return setDataReservation(item)
    })

    return res.status(200).send(r)
}

export const getReservationByUser = async (req, res) => {

    const { id } = req.params
    const query = `SELECT * from reservations where user_id=$1`
    const result = await client.query(query, [id])
    const reservations = result.rows

    const reservationsParsed = reservations.map(item => {
        return setDataReservation(item)
    })

    res.status(200).send(reservationsParsed)
}

export const getReservationByAccommodation = async (req, res) => {
    try {
        const { id } = req.params
        const query = `SELECT initial_date, final_date FROM reservations WHERE accommodation_id = $1`
        const result = await client.query(query, [id])
        const dates = result.rows

        const datasReservadas = []

        for (const date of dates) {
            const dataInicial = new Date(date.initial_date)
            const dataFinal = new Date(date.final_date)

            for (let d = dataInicial; d <= dataFinal; d.setDate(d.getDate() + 1)) {
                datasReservadas.push(new Date(d))
            }
        }

        res.status(200).send(datasReservadas)

    } catch (error) {
        res.status(400).send({ message: 'Erro ao buscar datas reservadas!' })

    }

}

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params
        const query = `DELETE from reservations WHERE id=$1`
        const result = await client.query(query, [id])

        res.status(200).send({ message: 'Reserva excluída com sucesso!' })

    } catch (error) {
        res.status(400).send({ message: 'Erro ao excluir reserva!' })
        console.log(error);


    }
}

export default { createReservation, listReservations, deleteReservation, getReservationByUser, getReservationByAccommodation }