import { IncomingForm } from 'formidable';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // ⚠️ 来自 Vercel 环境变量
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Parse error:', err);
      return res.status(500).json({ error: 'Form parse error' });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = fs.readFileSync(file.filepath);
    const filename = `${Date.now()}_${file.originalFilename}`;

    try {
      const upload = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: file.mimetype,
      });

      await s3.send(upload);

      const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

      res.status(200).json({ url: publicUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
}
