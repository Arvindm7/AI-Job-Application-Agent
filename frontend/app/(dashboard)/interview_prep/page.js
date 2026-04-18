'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { apiClient } from '@/lib/api'

export default function InterviewPrep() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('behavioral')

  const run = async () => {
    if (!file || !jd) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await apiClient.interviewPrep(file, jd)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { key: 'behavioral', label: '🧠 Behavioral' },
    { key: 'technical', label: '💻 Technical' },
    { key: 'situational', label: '🎯 Situational' },
    { key: 'ask', label: '❓ Ask Them' },
    { key: 'study', label: '📚 Study Plan' },
    { key: 'tips', label: '💡 Tips' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Interview Prep Kit</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontWeight: 300 }}>
        Get questions, study plan and resources to ace your interview.
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
          {loading ? '⏳ Building your prep kit...' : '🎤 Generate Interview Prep'}
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

          {/* meta */}
          <div className="card" style={{ padding: 20, display: 'flex', gap: 24, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{result.role_title}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{result.company_name}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prep Time</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#b89ffe' }}>{result.total_prep_days} days</div>
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: '8px 16px', borderRadius: 100, fontSize: 13,
                fontWeight: activeTab === t.key ? 600 : 400,
                background: activeTab === t.key ? 'rgba(108,71,255,0.2)' : 'var(--surface)',
                border: activeTab === t.key ? '1px solid rgba(108,71,255,0.4)' : '1px solid var(--border)',
                color: activeTab === t.key ? '#b89ffe' : 'var(--muted)',
                cursor: 'pointer', transition: 'all 0.15s'
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="card" style={{ padding: 24 }}>

            {activeTab === 'behavioral' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🧠 Behavioral Questions</h3>
                {result.behavioral_questions.map((q, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', marginBottom: 10,
                    background: 'var(--surface2)', borderRadius: 10,
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6
                  }}>
                    <span style={{ color: 'var(--muted)', marginRight: 8, fontSize: 12 }}>Q{i + 1}.</span>
                    {q}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'technical' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💻 Technical Questions</h3>
                {result.technical_questions.map((q, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', marginBottom: 10,
                    background: 'var(--surface2)', borderRadius: 10,
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6
                  }}>
                    <span style={{ color: 'var(--muted)', marginRight: 8, fontSize: 12 }}>Q{i + 1}.</span>
                    {q}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'situational' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎯 Situational Questions</h3>
                {result.situational_questions.map((q, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', marginBottom: 10,
                    background: 'var(--surface2)', borderRadius: 10,
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6
                  }}>
                    <span style={{ color: 'var(--muted)', marginRight: 8, fontSize: 12 }}>Q{i + 1}.</span>
                    {q}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ask' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>❓ Questions to Ask the Interviewer</h3>
                {result.questions_to_ask_interviewer.map((q, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', marginBottom: 10,
                    background: 'var(--surface2)', borderRadius: 10,
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6
                  }}>
                    <span style={{ color: '#b89ffe', marginRight: 8, fontSize: 12 }}>→</span>
                    {q}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'study' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>📚 Study Plan</h3>

                {/* daily plan */}
                <h4 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Day by Day Plan
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {result.daily_plan.map((day, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                      padding: '14px 16px', background: 'var(--surface2)', borderRadius: 10
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(108,71,255,0.2)', border: '1px solid rgba(108,71,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#b89ffe'
                      }}>
                        {day.day}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{day.focus}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                          {day.topics.join(' · ')}
                        </div>
                        <div style={{ fontSize: 12, color: '#3ecf8e' }}>Goal: {day.goal}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* study topics with resources */}
                <h4 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Topics & Resources
                </h4>
                {result.study_topics.map((topic, i) => (
                  <div key={i} style={{
                    padding: '16px', marginBottom: 12,
                    background: 'var(--surface2)', borderRadius: 12,
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{topic.topic}</div>
                      <span style={{
                        fontSize: 11, padding: '2px 10px', borderRadius: 100,
                        background: 'rgba(108,71,255,0.15)', color: '#b89ffe'
                      }}>
                        {topic.days_needed} days
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                      {topic.why_important}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {topic.resources.map((r, j) => (
                        <a key={j} href={r.url} target="_blank" rel="noreferrer" style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 12px', background: 'var(--surface)',
                          borderRadius: 8, textDecoration: 'none',
                          border: '1px solid var(--border)', transition: 'border-color 0.15s'
                        }}>
                          <div>
                            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{r.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                              {r.type} · {r.duration}
                            </div>
                          </div>
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 100,
                            background: r.priority === 'must'
                              ? 'rgba(255,77,141,0.15)'
                              : r.priority === 'recommended'
                              ? 'rgba(249,168,37,0.15)'
                              : 'rgba(255,255,255,0.08)',
                            color: r.priority === 'must'
                              ? '#ff4d8d'
                              : r.priority === 'recommended'
                              ? '#f9a825'
                              : 'var(--muted)'
                          }}>
                            {r.priority}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tips' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💡 Key Talking Points</h3>
                {result.key_talking_points.map((t, i) => (
                  <div key={i} style={{
                    padding: '12px 16px', marginBottom: 10,
                    background: 'var(--surface2)', borderRadius: 10,
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
                    borderLeft: '3px solid rgba(108,71,255,0.5)'
                  }}>{t}</div>
                ))}

                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, marginTop: 24, color: '#ff4d8d' }}>
                  ⚠️ Red Flags to Address
                </h3>
                {result.red_flags_to_address.map((r, i) => (
                  <div key={i} style={{
                    padding: '12px 16px', marginBottom: 10,
                    background: 'rgba(255,77,141,0.05)', borderRadius: 10,
                    fontSize: 14, color: 'var(--muted)', lineHeight: 1.6,
                    borderLeft: '3px solid rgba(255,77,141,0.4)'
                  }}>{r}</div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}