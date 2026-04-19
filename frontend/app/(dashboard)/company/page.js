'use client'
import { useState } from 'react'
import { apiClient } from '@/lib/api'

const TABS = [
  { key: 'overview', label: '🏢 Overview' },
  { key: 'talking_points', label: '🗣️ What to Say' },
  { key: 'culture', label: '🌱 Culture' },
  { key: 'market', label: '📈 Market' },
  { key: 'leadership', label: '👤 Leadership' },
  { key: 'funding', label: '💰 Funding' },
  { key: 'interview', label: '🎤 Interview' },
  { key: 'news', label: '📰 News' },
  { key: 'verdict', label: '⚖️ Verdict' },
]

export default function CompanyResearch() {
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedIndex, setCopiedIndex] = useState(null)

const run = async () => {
    const trimmedCompany = companyName.trim()
    const trimmedRole = role.trim()

    if (!trimmedCompany) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const payload = {
        company_name: trimmedCompany,
        role: trimmedRole   // send empty string if no role
      }

      console.log('Sending payload:', payload)  // debug — check browser console

      const res = await apiClient.researchCompany(
        payload.company_name,
        payload.role
      )
      setResult(res.data)
      setActiveTab('talking_points')
    } catch (e) {
      console.error('Error:', e.response?.data)  // debug
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
}

  const copyText = async (text, index) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const scoreColor = (rating) => {
    const r = parseFloat(rating)
    if (r >= 4) return '#3ecf8e'
    if (r >= 3) return '#f9a825'
    return '#ff4d8d'
  }

  const categoryColor = (category) => {
    const map = {
      'Product': '#6c47ff',
      'Growth': '#3ecf8e',
      'Mission': '#ff4d8d',
      'Culture': '#f9a825',
      'Technology': '#b89ffe',
      'Market': '#3ecf8e',
    }
    return map[category] || '#b89ffe'
  }

  return (
    <div>
      {/* header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(108,71,255,0.12)',
          border: '1px solid rgba(108,71,255,0.25)',
          color: '#b89ffe', fontSize: 11, fontWeight: 500,
          padding: '4px 12px', borderRadius: 100, marginBottom: 12,
          letterSpacing: '0.05em', textTransform: 'uppercase'
        }}>
          🕵️ Company Research Agent
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Know Before You Apply
        </h1>
        <p style={{ color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6 }}>
          Get a complete insider brief — culture, funding, leadership, market position
          and exact talking points to use in your interview.
        </p>
      </div>

      {/* input */}
      <div className="card" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{
              fontSize: 12, color: 'var(--muted)', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              display: 'block', marginBottom: 8
            }}>Company Name *</label>
            <input
              style={{
                width: '100%', background: 'var(--surface2)',
                border: '1px solid var(--border)', borderRadius: 12,
                color: 'var(--text)', fontFamily: 'DM Sans',
                fontSize: 14, padding: '12px 14px', outline: 'none'
              }}
              placeholder="e.g. Google, Razorpay, Zepto, Anthropic..."
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              
            />
          </div>
          <div>
            <label style={{
              fontSize: 12, color: 'var(--muted)', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              display: 'block', marginBottom: 8
            }}>Role Applying For (optional)</label>
            <input
              style={{
                width: '100%', background: 'var(--surface2)',
                border: '1px solid var(--border)', borderRadius: 12,
                color: 'var(--text)', fontFamily: 'DM Sans',
                fontSize: 14, padding: '12px 14px', outline: 'none'
              }}
              placeholder="e.g. Backend Engineer, Data Scientist..."
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={run}
          disabled={!companyName.trim() || loading}
        >
          {loading ? '⏳ Agent researching company...' : '🕵️ Deep Research Company'}
        </button>

        {loading && (
          <div style={{
            marginTop: 14, padding: '12px 16px',
            background: 'rgba(108,71,255,0.08)',
            border: '1px solid rgba(108,71,255,0.2)',
            borderRadius: 10, fontSize: 13, color: '#b89ffe', lineHeight: 1.7
          }}>
            🤖 Researching <strong>{companyName}</strong> — scraping news,
            analyzing funding, leadership, culture, market position
            and generating interview talking points...
          </div>
        )}

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

          {/* company header */}
          <div className="card" style={{ padding: 28, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
                  {result.company_name}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6, maxWidth: 500, marginBottom: 12 }}>
                  {result.what_they_do}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>🏭 {result.industry}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {result.headquarters}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>👥 {result.employee_count}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>📅 Est. {result.founded}</span>
                </div>
                {result.website && (
                  <a href={result.website} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#b89ffe', textDecoration: 'none' }}>
                    🌐 {result.website}
                  </a>
                )}
              </div>

              {/* quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                {[
                  { label: 'Glassdoor', value: result.glassdoor_rating, color: scoreColor(result.glassdoor_rating) },
                  { label: 'Interview', value: result.interview_difficulty, color: '#f9a825' },
                  { label: 'Stage', value: result.growth_stage, color: '#b89ffe' },
                  { label: 'Valuation', value: result.valuation, color: '#3ecf8e' },
                ].map((s, i) => (
                  <div key={i} style={{
                    textAlign: 'center', padding: '10px 16px',
                    background: 'var(--surface2)', borderRadius: 10
                  }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: s.color, textTransform: 'capitalize',
                      fontFamily: 'Bricolage Grotesque'
                    }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: '9px 16px', borderRadius: 10, fontSize: 12,
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

          <div className="card" style={{ padding: 28 }}>

            {/* WHAT TO SAY — most important tab */}
            {activeTab === 'talking_points' && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                    🗣️ What to Say in Your Interview
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6 }}>
                    These are ready-to-use talking points. Memorize 2-3 and drop them naturally
                    when the interviewer asks "What do you know about us?" or "Why do you want to work here?"
                  </p>
                </div>

                {/* talking points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                  {result.interview_talking_points?.map((point, i) => (
                    <div key={i} style={{
                      padding: '18px 20px',
                      background: 'var(--surface2)',
                      borderRadius: 14,
                      border: `1px solid ${categoryColor(point.category)}33`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <span style={{
                          fontSize: 11, padding: '3px 10px', borderRadius: 100,
                          fontWeight: 600, letterSpacing: '0.04em',
                          background: `${categoryColor(point.category)}22`,
                          color: categoryColor(point.category),
                          border: `1px solid ${categoryColor(point.category)}44`
                        }}>
                          {point.category}
                        </span>
                        <button
                          onClick={() => copyText(point.what_to_say, i)}
                          style={{
                            background: copiedIndex === i ? 'rgba(62,207,142,0.15)' : 'rgba(255,255,255,0.06)',
                            border: `1px solid ${copiedIndex === i ? 'rgba(62,207,142,0.3)' : 'var(--border)'}`,
                            color: copiedIndex === i ? '#3ecf8e' : 'var(--muted)',
                            padding: '4px 12px', borderRadius: 6,
                            fontSize: 11, cursor: 'pointer'
                          }}
                        >
                          {copiedIndex === i ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>

                      {/* what to say */}
                      <div style={{
                        fontSize: 14, color: 'var(--text)',
                        lineHeight: 1.8, marginBottom: 10,
                        fontStyle: 'italic',
                        borderLeft: `3px solid ${categoryColor(point.category)}`,
                        paddingLeft: 14
                      }}>
                        "{point.what_to_say}"
                      </div>

                      {/* why it impresses */}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 11, color: '#3ecf8e', flexShrink: 0, marginTop: 2 }}>
                          ✓ Why this impresses:
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                          {point.why_it_impresses}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* why work here */}
                <div style={{ marginBottom: 28 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#f9a825' }}>
                    💛 Why You Want to Work Here — Specific Reasons
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.why_work_here?.map((reason, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                        padding: '12px 16px', background: 'rgba(249,168,37,0.06)',
                        border: '1px solid rgba(249,168,37,0.15)',
                        borderRadius: 10
                      }}>
                        <span style={{ color: '#f9a825', flexShrink: 0, marginTop: 1 }}>→</span>
                        <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* how you can contribute */}
                {result.how_you_can_contribute && (
                  <div style={{ marginBottom: 28 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#b89ffe' }}>
                      🚀 How You Can Contribute
                    </h4>
                    <div style={{
                      padding: '16px 18px',
                      background: 'rgba(108,71,255,0.08)',
                      border: '1px solid rgba(108,71,255,0.2)',
                      borderRadius: 12,
                      fontSize: 14, color: 'var(--text)',
                      lineHeight: 1.8, fontWeight: 300
                    }}>
                      {result.how_you_can_contribute}
                    </div>
                  </div>
                )}

                {/* company challenges */}
                <div style={{ marginBottom: 28 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#ff4d8d' }}>
                    ⚠️ Current Company Challenges
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, fontWeight: 300 }}>
                    Knowing these shows you did real research. You can reference them when asked
                    "What challenges do you think we face?"
                  </p>
                  {result.company_challenges?.map((challenge, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: 'var(--text)', marginBottom: 10,
                      padding: '12px 14px', background: 'rgba(255,77,141,0.06)',
                      border: '1px solid rgba(255,77,141,0.15)',
                      borderRadius: 10, lineHeight: 1.6
                    }}>
                      {challenge}
                    </div>
                  ))}
                </div>

                {/* smart questions to ask */}
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#3ecf8e' }}>
                    ❓ Smart Questions to Ask the Interviewer
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, fontWeight: 300 }}>
                    These are specific to {result.company_name} — not generic questions.
                    They show you researched deeply.
                  </p>
                  {result.questions_to_ask?.map((q, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 16px', marginBottom: 10,
                      background: 'rgba(62,207,142,0.06)',
                      border: '1px solid rgba(62,207,142,0.15)',
                      borderRadius: 10
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'rgba(62,207,142,0.2)', color: '#3ecf8e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏢 Company Overview</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    padding: '16px', background: 'var(--surface2)',
                    borderRadius: 12
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Mission</div>
                    <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic' }}>
                      "{result.mission}"
                    </p>
                  </div>
                  <div style={{
                    padding: '16px', background: 'var(--surface2)',
                    borderRadius: 12
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Vision</div>
                    <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic' }}>
                      "{result.vision}"
                    </p>
                  </div>
                </div>

                {/* core values */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Core Values</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.core_values?.map((v, i) => (
                      <span key={i} style={{
                        padding: '5px 14px', borderRadius: 100, fontSize: 12,
                        background: 'rgba(108,71,255,0.15)', color: '#b89ffe',
                        border: '1px solid rgba(108,71,255,0.2)'
                      }}>{v}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Products & Services</div>
                    {result.products?.map((p, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: 'var(--text)', marginBottom: 8,
                        padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8
                      }}>• {p}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tech Stack</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.tech_stack?.map((t, i) => (
                        <span key={i} style={{
                          padding: '4px 10px', borderRadius: 100, fontSize: 11,
                          background: 'rgba(62,207,142,0.12)', color: '#3ecf8e',
                          border: '1px solid rgba(62,207,142,0.2)'
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ padding: '14px', background: 'var(--surface2)', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Customers</div>
                    <div style={{ fontSize: 13, color: 'var(--text)' }}>{result.target_customers}</div>
                  </div>
                  <div style={{ padding: '14px', background: 'var(--surface2)', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Model</div>
                    <div style={{ fontSize: 13, color: 'var(--text)' }}>{result.business_model}</div>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div style={{
                    display: 'inline-block', padding: '6px 18px',
                    background: 'rgba(62,207,142,0.15)',
                    border: '1px solid rgba(62,207,142,0.2)',
                    borderRadius: 100, fontSize: 14, color: '#3ecf8e', fontWeight: 600
                  }}>
                    💰 Salary Range: {result.salary_range}
                  </div>
                </div>
              </div>
            )}

            {/* CULTURE */}
            {activeTab === 'culture' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🌱 Culture & Work Life</h3>

                {result.ceo_quote && (
                  <div style={{
                    padding: '16px 20px', marginBottom: 20,
                    background: 'rgba(108,71,255,0.08)',
                    border: '1px solid rgba(108,71,255,0.2)',
                    borderRadius: 12, borderLeft: '3px solid #6c47ff'
                  }}>
                    <div style={{ fontSize: 11, color: '#b89ffe', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      CEO Quote
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.8, fontStyle: 'italic' }}>
                      "{result.ceo_quote}"
                    </p>
                  </div>
                )}

                <div style={{
                  padding: '14px 16px', background: 'var(--surface2)',
                  borderRadius: 12, marginBottom: 20,
                  borderLeft: '3px solid rgba(62,207,142,0.5)'
                }}>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>
                    {result.culture_summary}
                  </p>
                </div>

                <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Work-Life Balance:</span>
                  <span style={{
                    padding: '4px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                    background: 'rgba(62,207,142,0.15)', color: '#3ecf8e',
                    textTransform: 'capitalize'
                  }}>{result.work_life_balance}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <h4 style={{ fontSize: 13, color: '#3ecf8e', marginBottom: 12 }}>👍 Pros</h4>
                    {result.pros?.map((p, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: 'var(--muted)', marginBottom: 8,
                        paddingLeft: 12, lineHeight: 1.6,
                        borderLeft: '2px solid rgba(62,207,142,0.3)'
                      }}>{p}</div>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 13, color: '#ff4d8d', marginBottom: 12 }}>👎 Cons</h4>
                    {result.cons?.map((c, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: 'var(--muted)', marginBottom: 8,
                        paddingLeft: 12, lineHeight: 1.6,
                        borderLeft: '2px solid rgba(255,77,141,0.3)'
                      }}>{c}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 13, color: '#f9a825', marginBottom: 12 }}>🎁 Notable Perks</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.notable_perks?.map((perk, i) => (
                      <span key={i} style={{
                        padding: '5px 14px', borderRadius: 100, fontSize: 12,
                        background: 'rgba(249,168,37,0.12)', color: '#f9a825',
                        border: '1px solid rgba(249,168,37,0.2)'
                      }}>{perk}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MARKET */}
            {activeTab === 'market' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📈 Market Position</h3>

                <div style={{
                  padding: '16px 18px', background: 'var(--surface2)',
                  borderRadius: 12, marginBottom: 20,
                  borderLeft: '3px solid rgba(62,207,142,0.5)'
                }}>
                  <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.8 }}>
                    {result.market_position}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div style={{ padding: '14px', background: 'var(--surface2)', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Market Size
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#3ecf8e' }}>
                      {result.market_size}
                    </div>
                  </div>
                  <div style={{ padding: '14px', background: 'var(--surface2)', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Competitive Advantage
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                      {result.competitive_advantage}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 13, color: '#b89ffe', marginBottom: 12 }}>🏆 Recent Achievements</h4>
                  {result.recent_achievements?.map((a, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: 'var(--text)', marginBottom: 8,
                      padding: '10px 14px', background: 'rgba(108,71,255,0.08)',
                      border: '1px solid rgba(108,71,255,0.15)',
                      borderRadius: 10, lineHeight: 1.5
                    }}>
                      🏅 {a}
                    </div>
                  ))}
                </div>

                <div>
                  <h4 style={{ fontSize: 13, color: '#f9a825', marginBottom: 12 }}>⚔️ Competitors</h4>
                  {result.competitors?.map((c, i) => (
                    <div key={i} style={{
                      padding: '14px 16px', marginBottom: 10,
                      background: 'var(--surface2)', borderRadius: 10
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                        vs {result.company_name}: {c.how_different}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEADERSHIP */}
            {activeTab === 'leadership' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>👤 Leadership Team</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 14 }}>
                  {result.leadership?.map((leader, i) => (
                    <div key={i} style={{
                      padding: '18px', background: 'var(--surface2)',
                      borderRadius: 14, border: '1px solid var(--border)'
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', marginBottom: 12,
                        background: 'rgba(108,71,255,0.2)',
                        border: '1px solid rgba(108,71,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 700, color: '#b89ffe'
                      }}>
                        {leader.name.charAt(0)}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{leader.name}</div>
                      <div style={{
                        fontSize: 11, color: '#b89ffe', marginBottom: 8,
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>
                        {leader.role}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                        {leader.background}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FUNDING */}
            {activeTab === 'funding' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💰 Funding & Financials</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Total Funding', value: result.total_funding, color: '#3ecf8e' },
                    { label: 'Valuation', value: result.valuation, color: '#b89ffe' },
                    { label: 'Revenue', value: result.revenue, color: '#f9a825' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      textAlign: 'center', padding: '16px',
                      background: 'var(--surface2)', borderRadius: 12
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {result.investors?.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Investors</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {result.investors.map((inv, i) => (
                        <span key={i} style={{
                          padding: '4px 12px', borderRadius: 100, fontSize: 12,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border)', color: 'var(--muted)'
                        }}>{inv}</span>
                      ))}
                    </div>
                  </div>
                )}

                {result.funding_rounds?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Funding Rounds</h4>
                    {result.funding_rounds.map((round, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '14px 18px', marginBottom: 8,
                        background: 'var(--surface2)', borderRadius: 10
                      }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#b89ffe', marginRight: 10 }}>{round.round}</span>
                          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{round.date}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#3ecf8e' }}>{round.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* INTERVIEW */}
            {activeTab === 'interview' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎤 Interview Process</h3>

                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)', marginRight: 10 }}>Difficulty:</span>
                  <span style={{
                    padding: '4px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                    background: 'rgba(249,168,37,0.15)', color: '#f9a825',
                    textTransform: 'capitalize'
                  }}>{result.interview_difficulty}</span>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Interview Stages
                  </h4>
                  {result.interview_process?.map((stage, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 16, marginBottom: 12,
                      padding: '14px', background: 'var(--surface2)', borderRadius: 10
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(108,71,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#b89ffe'
                      }}>{i + 1}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{stage.stage}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{stage.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <h4 style={{ fontSize: 13, color: '#b89ffe', marginBottom: 12 }}>📚 Commonly Asked Topics</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {result.commonly_asked_topics?.map((t, i) => (
                        <span key={i} style={{
                          padding: '4px 12px', borderRadius: 100, fontSize: 12,
                          background: 'rgba(108,71,255,0.12)', color: '#b89ffe',
                          border: '1px solid rgba(108,71,255,0.2)'
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 13, color: '#3ecf8e', marginBottom: 12 }}>💡 Tips</h4>
                    {result.interview_tips?.map((tip, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: 'var(--muted)', marginBottom: 8,
                        paddingLeft: 12, lineHeight: 1.6,
                        borderLeft: '2px solid rgba(62,207,142,0.3)'
                      }}>{tip}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NEWS */}
            {activeTab === 'news' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📰 Recent News</h3>
                {result.recent_news?.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>No recent news found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {result.recent_news?.map((news, i) => (
                      <a key={i} href={news.url || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={{
                          padding: '16px 18px', background: 'var(--surface2)',
                          borderRadius: 12, border: '1px solid var(--border)',
                          transition: 'border-color 0.2s'
                        }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,71,255,0.4)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{news.title}</div>
                          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 8 }}>{news.summary}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                            📅 {news.date}
                            {news.url && <span style={{ color: '#b89ffe', marginLeft: 10 }}>Read →</span>}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VERDICT */}
            {activeTab === 'verdict' && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>⚖️ Honest Verdict</h3>

                <div style={{
                  padding: '18px 20px', marginBottom: 24,
                  background: 'linear-gradient(135deg, rgba(108,71,255,0.1), rgba(255,77,141,0.08))',
                  border: '1px solid rgba(108,71,255,0.2)',
                  borderRadius: 14
                }}>
                  <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.9, fontWeight: 300 }}>
                    {result.overall_verdict}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <h4 style={{ fontSize: 13, color: '#3ecf8e', marginBottom: 12 }}>🟢 Green Flags</h4>
                    {result.green_flags?.map((g, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: 'var(--muted)', marginBottom: 8,
                        paddingLeft: 12, lineHeight: 1.6,
                        borderLeft: '2px solid rgba(62,207,142,0.4)'
                      }}>{g}</div>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 13, color: '#ff4d8d', marginBottom: 12 }}>🔴 Red Flags</h4>
                    {result.red_flags?.map((r, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: 'var(--muted)', marginBottom: 8,
                        paddingLeft: 12, lineHeight: 1.6,
                        borderLeft: '2px solid rgba(255,77,141,0.4)'
                      }}>{r}</div>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: '14px 18px', background: 'var(--surface2)', borderRadius: 12
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    Best suited for
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                    {result.recommended_for}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}