import admin from "firebase-admin";

const firebaseKey = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  };

const BUCKET_ADDRESS = "seasons-71b90.firebasestorage.app"

admin.initializeApp({
    credential: admin.credential.cert(firebaseKey),
    storageBucket: BUCKET_ADDRESS
});

const bucket = admin.storage().bucket();

export const uploadFiles = async (req, res, next) => {

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

export const deleteAllFiles = async (req, res, next) => {
    try {
        const { files } = req.body

        const deletePromises = files.map(async (image) => {
            const imageURL = image.url.slice(image.url.lastIndexOf('/') + 1);
            const file = bucket.file(imageURL);
            await file.delete();
        });

        await Promise.all(deletePromises);
        next();

    } catch (error) {
        return res.status(500).json({ message: 'Não foi possível excluir as imagens' })
    }
}

export const deleteFile = async (imagem) => {
    try {
        const imageURL = imagem.url.slice(imagem.url.lastIndexOf('/') + 1);
        const file = bucket.file(imageURL);
        await file.delete();
        
    } catch (error) {
        
    }
        

}

export default { uploadFiles, deleteAllFiles, deleteFile };