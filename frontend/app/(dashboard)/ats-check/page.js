'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { apiClient } from '@/lib/api'

export default function ATSCheck() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await apiClient.atsCheck(file)
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
      {/* header */}
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        ATS Health Check
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontWeight: 300 }}>
        Upload your resume and get a full ATS compatibility report — no job description needed.
      </p>

      {/* upload card */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <FileUpload onFileSelect={setFile} />
        <button
          className="btn-primary"
          style={{ marginTop: 16 }}
          onClick={run}
          disabled={!file || loading}
        >
          {loading ? '⏳ Analyzing your resume...' : '🎯 Run ATS Check'}
        </button>

        {error && (
          <div style={{
            marginTop: 14, padding: '12px 16px',
            background: 'rgba(255,77,141,0.1)',
            border: '1px solid rgba(255,77,141,0.3)',
            borderRadius: 10, color: '#ff4d8d', fontSize: 13
          }}>
            {error}
          </div>
        )}
      </div>

      {/* results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* score card */}
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{
              fontSize: 72, fontWeight: 800,
              color: scoreColor(result.ats_score),
              fontFamily: 'Bricolage Grotesque',
              lineHeight: 1
            }}>
              {result.ats_score}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
              out of 100
            </div>

            {/* score bar */}
            <div style={{
              width: '60%', margin: '0 auto 16px',
              height: 6, background: 'var(--surface2)',
              borderRadius: 3, overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${result.ats_score}%`,
                background: `linear-gradient(90deg, var(--accent), ${scoreColor(result.ats_score)})`,
                transition: 'width 1s ease'
              }} />
            </div>

            <div style={{ fontSize: 16, color: 'var(--text)', fontWeight: 500, marginBottom: 12 }}>
              {result.verdict}
            </div>

            <div style={{
              display: 'inline-block', padding: '4px 14px',
              borderRadius: 100, fontSize: 12, fontWeight: 500,
              background: result.keyword_density === 'high'
                ? 'rgba(62,207,142,0.15)'
                : result.keyword_density === 'medium'
                ? 'rgba(249,168,37,0.15)'
                : 'rgba(255,77,141,0.15)',
              color: result.keyword_density === 'high'
                ? '#3ecf8e'
                : result.keyword_density === 'medium'
                ? '#f9a825'
                : '#ff4d8d',
            }}>
              Keyword density: {result.keyword_density}
            </div>
          </div>

          {/* issues + improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#ff4d8d' }}>
                ❌ Issues Found
              </h3>
              {result.issues_found.map((issue, i) => (
                <div key={i} style={{
                  fontSize: 13, color: 'var(--muted)', marginBottom: 10,
                  paddingLeft: 12, lineHeight: 1.6,
                  borderLeft: '2px solid rgba(255,77,141,0.3)'
                }}>
                  {issue}
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#3ecf8e' }}>
                ✅ How to Fix
              </h3>
              {result.improvements.map((imp, i) => (
                <div key={i} style={{
                  fontSize: 13, color: 'var(--muted)', marginBottom: 10,
                  paddingLeft: 12, lineHeight: 1.6,
                  borderLeft: '2px solid rgba(62,207,142,0.3)'
                }}>
                  {imp}
                </div>
              ))}
            </div>
          </div>

          {/* missing sections + formatting */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#f9a825' }}>
                📋 Missing Sections
              </h3>
              {result.missing_sections.length === 0 ? (
                <p style={{ fontSize: 13, color: '#3ecf8e' }}>All key sections present ✓</p>
              ) : (
                result.missing_sections.map((s, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: 'var(--muted)',
                    marginBottom: 8, paddingLeft: 12,
                    borderLeft: '2px solid rgba(249,168,37,0.3)'
                  }}>
                    {s}
                  </div>
                ))
              )}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#f9a825' }}>
                🔧 Formatting Issues
              </h3>
              {result.formatting_issues.length === 0 ? (
                <p style={{ fontSize: 13, color: '#3ecf8e' }}>No formatting issues ✓</p>
              ) : (
                result.formatting_issues.map((f, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: 'var(--muted)',
                    marginBottom: 8, paddingLeft: 12,
                    borderLeft: '2px solid rgba(249,168,37,0.3)'
                  }}>
                    {f}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* overall tips */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
              💡 Overall Tips
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.overall_tips.map((tip, i) => (
                <div key={i} style={{
                  fontSize: 13, color: 'var(--muted)', lineHeight: 1.6,
                  paddingLeft: 14,
                  borderLeft: '2px solid rgba(108,71,255,0.4)'
                }}>
                  {tip}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}