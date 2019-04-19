const express = require('express');
const app = express();
const Multer = require('multer');

const keyFilename = "./image-upload-node-firebase-adminsdk-raap8-4ad0fd413d.json"; //replace this with api key file
const projectId = "image-upload-node" //replace with your project id
// const bucketName = `${projectId}.appspot.com`;

const { Storage } = require('@google-cloud/storage');
// Creates a client
const storage = new Storage({
    projectId: projectId,
    keyFilename: keyFilename,
});

storage
    .getBuckets()
    .then((results) => {
        const buckets = results[0];

        console.log('Buckets:');
        buckets.forEach((bucket) => {
            bucket.upload()
            console.log(bucket.name);
        });
    })
    .catch((err) => {
        console.error('ERROR:', err);
    });

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

app.listen(3000, () => {
    console.log('App listening to port 3000');
});

var metadata = {
    contentType: 'image/jpeg',
    public: true
};


/**
 * Adding new file to the storage
 */
app.post('/upload', multer.single('file'), (req, res) => {

    let file = req.file;

    storage
        .getBuckets()
        .then((results) => {
            const buckets = results[0];
            const bucket = buckets[0];

            bucket.upload('./test1.jpg', metadata).then((image) => {
                res.status(200).send({
                    status: 'success',
                    image: image,
                });
            }).catch((err) => {
                res.status(500).send({
                    status: 'error',
                    msg: err
                });
            });
        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.status(500).send({
                status: 'error',
                msg: err
            });
        });
});


// image url ::: 
// https://storage.googleapis.com/image-upload-node.appspot.com/test1.jpg
// https://storage.googleapis.com/bucket.name/test1.jpg