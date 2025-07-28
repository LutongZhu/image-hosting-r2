import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

export async function uploadToR2(fileBuffer, filename, mimetype) {
  const result = await s3.upload({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filename,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: 'public-read',
  }).promise();

  return `${process.env.R2_PUBLIC_URL}/${filename}`;
}
