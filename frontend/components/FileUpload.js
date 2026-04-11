'use client'
import { useState } from 'react'

export default function FileUpload({ onFileSelect, label = "Upload Resume PDF" }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      onFileSelect(f)
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      onClick={() => document.getElementById('file-input').click()}
      style={{
        border: `2px dashed ${dragging ? '#6c47ff' : file ? 'rgba(108,71,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 14, padding: '32px 24px', textAlign: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
        background: dragging ? 'rgba(108,71,255,0.08)' : file ? 'rgba(108,71,255,0.05)' : 'transparent'
      }}
    >
      <input
        id="file-input" type="file" accept=".pdf"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div style={{ fontSize: 32, marginBottom: 10 }}>{file ? '✅' : '📄'}</div>
      <p style={{ fontSize: 15, fontWeight: 500, color: file ? '#b89ffe' : 'var(--text)', marginBottom: 4 }}>
        {file ? file.name : label}
      </p>
      <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>
        {file ? 'Click to change file' : 'Drag & drop or click to browse · PDF only'}
      </p>
    </div>
  )
}