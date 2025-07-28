import formidable from 'formidable';
import fs from 'fs';
import { uploadToR2 } from '../../lib/r2';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Parse error' });

    const file = files.file;
    const data = fs.readFileSync(file.filepath);
    const mimetype = file.mimetype;
    const filename = `${Date.now()}-${file.originalFilename}`;

    try {
      const url = await uploadToR2(data, filename, mimetype);
      res.status(200).json({ url });
    } catch (e) {
      res.status(500).json({ error: 'Upload failed', details: e.message });
    }
  });
}
