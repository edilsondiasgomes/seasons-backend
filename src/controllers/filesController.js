import firebaseService from '../services/firebase.service.js';
import client from './../database.js';

export async function getFilesAccommodation(accommodationId) {
    try {
        const query = `SELECT id, url FROM public.accommodation_files WHERE accommodation_id = $1`;
        const values = [accommodationId];
        const files = await client.query(query, values);
        return files.rows

    } catch (error) {
        console.log('Erro ao buscar imagens');
    }
}

export async function insertFilesAccommodation(accommodationId, files) {
    try {
        const queryFiles = `INSERT INTO accommodation_files(accommodation_id, url) VALUES($1, $2)`;

        for (const file of files) {
            await client.query(queryFiles, [accommodationId, file.firebaseUrl]);
        }

    } catch (error) {
        console.error("Erro ao inserir arquivos:", error);
    }
}

export async function deleteFilesAccomodationByID(id) {
    const result = await client.query(`DELETE from accommodation_files WHERE accommodation_id = $1`, [id])
    // return result.rows
}

export async function filesToDelete(filesDataBase, filesFront) {
    return filesDataBase.filter(fileDataBase => !filesFront.some(fileFront => fileFront.id === fileDataBase.id))
}

export async function deleteFilesExcludedFront(accommodationID, filesDataBase, filesFront) {
    const filesToDelete = filesDataBase.filter(fileDataBase => !filesFront.some(fileFront => fileFront.id === fileDataBase.id))

    const query = `DELETE FROM accommodation_files WHERE accommodation_id = $1 AND id = $2`;

    for (const file of filesToDelete) {
        await client.query(query, [accommodationID, file.id]);
        if (file) {
            await firebaseService.deleteFile(file);
        }
    }
}

export default { getFilesAccommodation, insertFilesAccommodation, deleteFilesAccomodationByID, deleteFilesExcludedFront, filesToDelete }
