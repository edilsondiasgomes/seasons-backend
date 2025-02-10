import admin from "firebase-admin";
import firebaseKey from "../config/firebase.key.json" assert { type: "json" };
import { ref, deleteObject } from "firebase/storage";

const BUCKET_ADDRESS = "seasons-71b90.firebasestorage.app"

admin.initializeApp({
    credential: admin.credential.cert(firebaseKey),
    storageBucket: BUCKET_ADDRESS
});

const bucket = admin.storage().bucket();

export const uploadFile = async (req, res, next) => {

    if (req.files.length < 1) {
        return next();
    }

    try {


        const uploadPromises = req.files.map(async (file) => {

            const nameFile = Date.now() + "." + file.originalname.split(".").pop();
            const nameBucketFile = bucket.file(nameFile);
            const stream = nameBucketFile.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                }
            });

            return new Promise((resolve, reject) => {

                stream.on("error", (e) => {
                    console.log(e)
                })

                stream.on("finish", async () => {
                    await nameBucketFile.makePublic();
                    file.firebaseUrl = `https://storage.googleapis.com/${BUCKET_ADDRESS}/${nameFile}`,
                        resolve();
                });

                stream.end(file.buffer);
            })

        });
        await Promise.all(uploadPromises);

        next()

    } catch (error) {
        console.log(error);


    }
}

export const deleteFile = async (req, res) => {
    try {
        const { image } = req.body

        const file = bucket.file(image)

        await file.delete();

        return res.status(200).json({ message: 'Imagem excluída com sucesso' })

    } catch (error) {
        return res.status(500).json({ message: 'Não foi possível excluir a imagem' })
    }


}

export default { uploadFile, deleteFile };