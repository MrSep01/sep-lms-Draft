const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAV3OEQTTQ6BPOZNIA',
  secretAccessKey: 'Sbiv9jWD05PpUFFrhJvOHrh9VwLs3c30ZtR5c3di',
  region: 'us-east-2',
});

const s3 = new AWS.S3();
module.exports = s3;



// const bucketName = 'sep01lmsbucket'; // replace with your actual bucket name
// const testFileName = 'testfile.jpg'; // replace with a test file name


// async function getPresignedUploadURL(filename) {
//   const params = {
//     Bucket: bucketName,
//     Key: filename,
//     Expires: 60 // URL expiry time in seconds
//   };

//   try {
//     const url = await s3.getSignedUrlPromise('putObject', params);
//     return url;
//   } catch (error) {
//     console.error("Error generating signed URL", error);
//     throw new Error("Error generating signed URL");
//   }
// }

// getPresignedUploadURL(testFileName)
//   .then(url => {
//     console.log("Generated Presigned URL: ", url);
//   })
//   .catch(error => {
//     console.error("Error: ", error);
//   });


