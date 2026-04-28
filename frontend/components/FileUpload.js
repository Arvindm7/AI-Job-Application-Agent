'use client'
import { useState, useEffect } from 'react'
import { resumeStore } from '@/lib/resumeStore'

export default function FileUpload({
  onFileSelect,
  label = "Upload Resume PDF",
  currentFile = null
}) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(currentFile)
  const [usingSaved, setUsingSaved] = useState(false)

  useEffect(() => {
    if (currentFile) {
      setFile(currentFile)
      setUsingSaved(resumeStore.exists())
      return
    }
    // auto load saved resume
    if (resumeStore.exists()) {
      const saved = resumeStore.getFile()
      if (saved) {
        setFile(saved)
        setUsingSaved(true)
        onFileSelect(saved)
      }
    }
  }, [currentFile])

  const handleFile = async (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setUsingSaved(false)
      try { await resumeStore.save(f) } catch (e) {}
      onFileSelect(f)
    }
  }

  const clearSaved = (e) => {
    e.stopPropagation()
    resumeStore.clear()
    setFile(null)
    setUsingSaved(false)
    onFileSelect(null)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => document.getElementById('resume-file-input').click()}
        style={{
          border: `2px dashed ${dragging ? '#6c47ff' : file ? (usingSaved ? 'rgba(62,207,142,0.4)' : 'rgba(108,71,255,0.4)') : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 14, padding: '20px 24px',
          textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
          background: dragging ? 'rgba(108,71,255,0.08)' : usingSaved ? 'rgba(62,207,142,0.04)' : file ? 'rgba(108,71,255,0.04)' : 'transparent'
        }}
      >
        <input id="resume-file-input" type="file" accept=".pdf" style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])} />
        {file ? (
          <div>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{usingSaved ? '💾' : '✅'}</div>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: usingSaved ? '#3ecf8e' : '#b89ffe' }}>
              {file.name}
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 300 }}>
              {usingSaved ? `Saved · ${resumeStore.savedAgo()}` : `${(file.size / 1024).toFixed(0)} KB`} · Click to change
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, color: 'var(--text)' }}>{label}</p>
            <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 300 }}>Drag & drop or click · PDF only</p>
          </div>
        )}
      </div>
      {usingSaved && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 6, padding: '6px 12px',
          background: 'rgba(62,207,142,0.08)', border: '1px solid rgba(62,207,142,0.2)', borderRadius: 8
        }}>
          <span style={{ fontSize: 11, color: '#3ecf8e' }}>💾 Using saved resume · {resumeStore.savedAgo()}</span>
          <button onClick={clearSaved} style={{
            background: 'transparent', border: 'none', color: 'var(--muted)',
            fontSize: 11, cursor: 'pointer'
          }}
            onMouseEnter={e => e.target.style.color = '#ff4d8d'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >✕ Clear</button>
        </div>
      )}
    </div>
  )
}