'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { apiClient } from '@/lib/api'

export default function AnalyzeResume() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!file || !jd) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await apiClient.analyzeResume(file, jd)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (score) => {
    if (score >= 75) return '#3ecf8e'
    if (score >= 50) return '#f9a825'
    return '#ff4d8d'
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Resume Match Analyzer</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontWeight: 300 }}>
        Upload your resume and paste a job description to see how well you match.
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
          {loading ? '⏳ Analyzing...' : '📊 Analyze Match'}
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

          {/* score */}
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{
              fontSize: 72, fontWeight: 800, lineHeight: 1,
              color: scoreColor(result.match_score),
              fontFamily: 'Bricolage Grotesque'
            }}>
              {result.match_score}%
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>Match Score</div>
            <div style={{
              width: '60%', margin: '0 auto 16px',
              height: 6, background: 'var(--surface2)',
              borderRadius: 3, overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${result.match_score}%`,
                background: `linear-gradient(90deg, var(--accent), ${scoreColor(result.match_score)})`,
              }} />
            </div>
            <div style={{ fontSize: 15, color: 'var(--text)', fontWeight: 500 }}>{result.verdict}</div>
          </div>

          {/* skills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#3ecf8e' }}>
                ✅ Matched Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.matched_skills.map((s, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: 100, fontSize: 12,
                    background: 'rgba(62,207,142,0.15)', color: '#3ecf8e',
                    border: '1px solid rgba(62,207,142,0.2)'
                  }}>{s}</span>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#ff4d8d' }}>
                ❌ Missing Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.missing_skills.map((s, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: 100, fontSize: 12,
                    background: 'rgba(255,77,141,0.15)', color: '#ff4d8d',
                    border: '1px solid rgba(255,77,141,0.2)'
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* strengths + gaps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#b89ffe' }}>
                💪 Your Strengths
              </h3>
              {result.strengths.map((s, i) => (
                <div key={i} style={{
                  fontSize: 13, color: 'var(--muted)', marginBottom: 10,
                  paddingLeft: 12, lineHeight: 1.6,
                  borderLeft: '2px solid rgba(108,71,255,0.4)'
                }}>{s}</div>
              ))}
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#f9a825' }}>
                ⚠️ Gaps to Address
              </h3>
              {result.gaps.map((g, i) => (
                <div key={i} style={{
                  fontSize: 13, color: 'var(--muted)', marginBottom: 10,
                  paddingLeft: 12, lineHeight: 1.6,
                  borderLeft: '2px solid rgba(249,168,37,0.4)'
                }}>{g}</div>
              ))}
            </div>
          </div>

          {/* quick wins */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>⚡ Quick Wins</h3>
            {result.quick_wins.map((w, i) => (
              <div key={i} style={{
                fontSize: 13, color: 'var(--muted)', marginBottom: 10,
                paddingLeft: 14, lineHeight: 1.6,
                borderLeft: '2px solid rgba(108,71,255,0.4)'
              }}>{w}</div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}