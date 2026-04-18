'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { apiClient } from '@/lib/api'

export default function TailorResume() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [latex, setLatex] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!file || !jd) return
    setLoading(true); setError(''); setLatex('')
    try {
      const res = await apiClient.tailorLatex(file, jd)
      setLatex(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(latex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>ATS Resume Tailor</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontWeight: 300 }}>
        Get a LaTeX resume tailored for the job — paste it into Overleaf to download your PDF.
      </p>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <FileUpload onFileSelect={setFile} />
        <textarea
          className="input-area"
          style={{ marginTop: 16 }}
          placeholder="Paste the job description here..."
          value={jd}
          onChange={e => setJd(e.target.value)}
        />
        <button
          className="btn-primary"
          style={{ marginTop: 16 }}
          onClick={run}
          disabled={!file || !jd || loading}
        >
          {loading ? '⏳ Tailoring your resume...' : '✏️ Generate LaTeX Resume'}
        </button>
        {error && (
          <div style={{
            marginTop: 14, padding: '12px 16px',
            background: 'rgba(255,77,141,0.1)',
            border: '1px solid rgba(255,77,141,0.3)',
            borderRadius: 10, color: '#ff4d8d', fontSize: 13
          }}>{error}</div>
        )}
      </div>

      {latex && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>📄 LaTeX Code</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={copy} style={{
                background: copied ? 'rgba(62,207,142,0.15)' : 'rgba(108,71,255,0.15)',
                border: `1px solid ${copied ? 'rgba(62,207,142,0.3)' : 'rgba(108,71,255,0.3)'}`,
                color: copied ? '#3ecf8e' : '#b89ffe',
                padding: '8px 18px', borderRadius: 8,
                fontSize: 13, fontWeight: 500, cursor: 'pointer'
              }}>
                {copied ? '✓ Copied!' : 'Copy LaTeX'}
              </button>
              <a
                href="https://www.overleaf.com/project"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'rgba(62,207,142,0.15)',
                  border: '1px solid rgba(62,207,142,0.3)',
                  color: '#3ecf8e', padding: '8px 18px',
                  borderRadius: 8, fontSize: 13,
                  fontWeight: 500, textDecoration: 'none'
                }}
              >
                Open Overleaf →
              </a>
            </div>
          </div>

          {/* how to use */}
          <div style={{
            background: 'rgba(108,71,255,0.08)',
            border: '1px solid rgba(108,71,255,0.2)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 16
          }}>
            <p style={{ fontSize: 12, color: '#b89ffe', fontWeight: 500, marginBottom: 6 }}>
              How to get your PDF:
            </p>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
              1. Click <strong style={{ color: 'var(--text)' }}>Copy LaTeX</strong> above →
              2. Click <strong style={{ color: 'var(--text)' }}>Open Overleaf</strong> →
              3. New Project → Blank Project →
              4. Delete all code → Paste →
              5. Click <strong style={{ color: 'var(--text)' }}>Recompile</strong> → Download PDF
            </p>
          </div>

          <pre style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: 10, padding: 20,
            fontSize: 12, color: '#b89ffe',
            lineHeight: 1.7, overflowX: 'auto',
            maxHeight: 500, overflowY: 'auto',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word'
          }}>
            {latex}
          </pre>
        </div>
      )}
    </div>
  )
}