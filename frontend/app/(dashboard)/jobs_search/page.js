'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { apiClient } from '@/lib/api'

export default function FindJobs() {
  const [file, setFile] = useState(null)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('India')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('match') // match | search

  const runMatch = async () => {
    if (!file) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await apiClient.matchJobs(file, location, remoteOnly)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const runSearch = async () => {
    if (!query) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await apiClient.searchJobs(query, location, remoteOnly)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (score) => {
    if (!score) return 'var(--muted)'
    if (score >= 75) return '#3ecf8e'
    if (score >= 50) return '#f9a825'
    return '#ff4d8d'
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Find Jobs</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontWeight: 300 }}>
        Upload your resume to find AI matched jobs, or search directly by title.
      </p>

      {/* mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'match', label: '🤖 AI Match from Resume' },
          { key: 'search', label: '🔍 Search by Title' }
        ].map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} style={{
            padding: '10px 20px', borderRadius: 10, fontSize: 14,
            fontWeight: mode === m.key ? 600 : 400,
            background: mode === m.key ? 'rgba(108,71,255,0.2)' : 'var(--surface)',
            border: mode === m.key ? '1px solid rgba(108,71,255,0.4)' : '1px solid var(--border)',
            color: mode === m.key ? '#b89ffe' : 'var(--muted)',
            cursor: 'pointer', transition: 'all 0.15s'
          }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        {mode === 'match' ? (
          <FileUpload onFileSelect={setFile} />
        ) : (
          <input
            style={{
              width: '100%', background: 'var(--surface2)',
              border: '1px solid var(--border)', borderRadius: 12,
              color: 'var(--text)', fontFamily: 'DM Sans',
              fontSize: 14, padding: '14px', outline: 'none'
            }}
            placeholder="e.g. Python Backend Engineer, Data Scientist..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        )}

        {/* filters */}
        <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
          <input
            style={{
              flex: 1, minWidth: 160,
              background: 'var(--surface2)',
              border: '1px solid var(--border)', borderRadius: 10,
              color: 'var(--text)', fontFamily: 'DM Sans',
              fontSize: 14, padding: '10px 14px', outline: 'none'
            }}
            placeholder="Location (e.g. Bangalore)"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 14, color: 'var(--muted)', cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={e => setRemoteOnly(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#6c47ff' }}
            />
            Remote only
          </label>
        </div>

        <button
          className="btn-primary"
          style={{ marginTop: 16 }}
          onClick={mode === 'match' ? runMatch : runSearch}
          disabled={mode === 'match' ? (!file || loading) : (!query || loading)}
        >
          {loading
            ? '⏳ Finding jobs...'
            : mode === 'match'
            ? '🤖 Find Matching Jobs'
            : '🔍 Search Jobs'
          }
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
        <div>
          {/* summary */}
          <div style={{ marginBottom: 16 }}>
            {result.extracted_title && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Searching as:</span>
                <span style={{
                  padding: '2px 12px', borderRadius: 100, fontSize: 12,
                  background: 'rgba(108,71,255,0.15)', color: '#b89ffe',
                  border: '1px solid rgba(108,71,255,0.2)'
                }}>{result.extracted_title}</span>
                {result.extracted_skills?.slice(0, 4).map((s, i) => (
                  <span key={i} style={{
                    padding: '2px 12px', borderRadius: 100, fontSize: 12,
                    background: 'rgba(255,255,255,0.05)', color: 'var(--muted)',
                    border: '1px solid var(--border)'
                  }}>{s}</span>
                ))}
              </div>
            )}
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              Found <strong style={{ color: 'var(--text)' }}>{result.total_found}</strong> jobs
            </p>
          </div>

          {/* job cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.jobs.map((job, i) => (
              <div key={i} className="card" style={{
                padding: 24, transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                    <div style={{ fontSize: 14, color: '#b89ffe', marginBottom: 6 }}>{job.company}</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {job.location}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>💼 {job.job_type}</span>
                      {job.remote && (
                        <span style={{
                          fontSize: 11, padding: '1px 8px', borderRadius: 100,
                          background: 'rgba(62,207,142,0.15)', color: '#3ecf8e'
                        }}>Remote</span>
                      )}
                      {job.salary !== 'Not specified' && (
                        <span style={{ fontSize: 12, color: '#3ecf8e' }}>💰 {job.salary}</span>
                      )}
                    </div>
                  </div>

                  {job.match_score > 0 && (
                    <div style={{ textAlign: 'center', flexShrink: 0, marginLeft: 16 }}>
                      <div style={{
                        fontSize: 24, fontWeight: 800,
                        color: scoreColor(job.match_score),
                        fontFamily: 'Bricolage Grotesque'
                      }}>
                        {job.match_score}%
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>match</div>
                    </div>
                  )}
                </div>

                {job.match_reason && (
                  <div style={{
                    fontSize: 12, color: 'var(--muted)', marginBottom: 12,
                    padding: '8px 12px', background: 'var(--surface2)',
                    borderRadius: 8, lineHeight: 1.5
                  }}>
                    {job.match_reason}
                  </div>
                )}

                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
                  {job.description_snippet}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>Posted: {job.posted_date}</span>
                  <a href={job.apply_url} target="_blank" rel="noreferrer" style={{
                    background: 'linear-gradient(135deg, #6c47ff, #ff4d8d)',
                    color: 'white', padding: '8px 20px', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, textDecoration: 'none'
                  }}>
                    Apply Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}