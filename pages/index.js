import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    if (data.url) setUrl(data.url);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>🖼️ 图床上传</h1>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>上传中...</p>}
      {url && (
        <div>
          <p>上传成功：</p>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          <br />
          <img src={url} alt="Uploaded" style={{ maxWidth: 400, marginTop: 10 }} />
        </div>
      )}
    </main>
  );
}
