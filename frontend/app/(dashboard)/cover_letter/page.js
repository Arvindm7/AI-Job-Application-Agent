'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { apiClient } from '@/lib/api'

export default function CoverLetter() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!file || !jd) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await apiClient.generateCoverLetter(file, jd)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(result.cover_letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Cover Letter Generator</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontWeight: 300 }}>
        Generate a personalized, compelling cover letter tailored to the job.
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
          {loading ? '⏳ Writing your cover letter...' : '📨 Generate Cover Letter'}
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

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* meta info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Role', value: result.role_title },
              { label: 'Company', value: result.company_name },
              { label: 'Addressed To', value: result.hiring_manager },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* cover letter */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>📨 Your Cover Letter</h3>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{result.word_count} words</span>
              </div>
              <button onClick={copy} style={{
                background: copied ? 'rgba(62,207,142,0.15)' : 'rgba(108,71,255,0.15)',
                border: `1px solid ${copied ? 'rgba(62,207,142,0.3)' : 'rgba(108,71,255,0.3)'}`,
                color: copied ? '#3ecf8e' : '#b89ffe',
                padding: '8px 18px', borderRadius: 8,
                fontSize: 13, fontWeight: 500, cursor: 'pointer'
              }}>
                {copied ? '✓ Copied!' : 'Copy Letter'}
              </button>
            </div>
            <div style={{
              fontSize: 14, color: 'var(--muted)', lineHeight: 2,
              whiteSpace: 'pre-wrap', fontWeight: 300
            }}>
              {result.cover_letter}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}