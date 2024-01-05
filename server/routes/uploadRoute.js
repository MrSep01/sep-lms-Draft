const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporarily store file locally

const s3 = new AWS.S3();

router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: file.originalname,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
        ACL: 'public-read' // or another ACL according to your requirements
    };

    s3.upload(s3Params, (err, data) => {
        if (err) {
            console.error('Error uploading to S3:', err);
            return res.status(500).send('Error uploading file');
        }
        // Delete the file from local storage
        fs.unlinkSync(file.path);
        res.json({ message: 'File uploaded successfully', url: data.Location });
    });
});

module.exports = router;
