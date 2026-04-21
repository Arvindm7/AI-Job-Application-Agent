'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { apiClient } from '@/lib/api'

const OUTREACH_TYPES = [
  {
    key: 'cold_email',
    label: 'Cold Email',
    icon: '📧',
    desc: 'Direct email to hiring manager or recruiter',
    color: '#6c47ff'
  },
  {
    key: 'linkedin_connect',
    label: 'LinkedIn Connect',
    icon: '🔗',
    desc: 'Connection request note (300 char limit)',
    color: '#0077b5'
  },
  {
    key: 'linkedin_message',
    label: 'LinkedIn Message',
    icon: '💬',
    desc: 'DM after connecting on LinkedIn',
    color: '#3ecf8e'
  },
  {
    key: 'referral_request',
    label: 'Referral Request',
    icon: '🤝',
    desc: 'Ask an employee for a referral',
    color: '#f9a825'
  },
]

const TONE_COLORS = {
  'Professional': '#b89ffe',
  'Conversational': '#3ecf8e',
  'Bold': '#ff4d8d',
  'Friendly': '#f9a825',
  'Direct': '#6c47ff',
  'Value-led': '#3ecf8e',
}

export default function OutreachEngine() {
  const [file, setFile] = useState(null)
  const [outreachType, setOutreachType] = useState('cold_email')
  const [targetCompany, setTargetCompany] = useState('')
  const [targetName, setTargetName] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [applyingRole, setApplyingRole] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeVariant, setActiveVariant] = useState(0)
  const [copied, setCopied] = useState(false)
  const [copiedFollowUp, setCopiedFollowUp] = useState(false)

  const run = async () => {
    if (!targetCompany.trim()) return
    setLoading(true); setError(''); setResult(null)

    try {
      const fd = new FormData()
      fd.append('target_company', targetCompany.trim())
      fd.append('outreach_type', outreachType)
      fd.append('target_name', targetName.trim())
      fd.append('target_role', targetRole.trim())
      fd.append('applying_role', applyingRole.trim())
      if (file) fd.append('file', file)

      const res = await apiClient.generateOutreach(fd)
      setResult(res.data)
      setActiveVariant(0)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyText = async (text, isFollowUp = false) => {
    await navigator.clipboard.writeText(text)
    if (isFollowUp) {
      setCopiedFollowUp(true)
      setTimeout(() => setCopiedFollowUp(false), 2000)
    } else {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const currentType = OUTREACH_TYPES.find(t => t.key === outreachType)

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
          📧 Cold Outreach Engine
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Cold Outreach Engine
        </h1>
        <p style={{ color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6 }}>
          Generate personalized cold emails, LinkedIn messages and referral
          requests that actually get replies — tailored to your resume and target company.
        </p>
      </div>

      {/* outreach type selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 12, color: 'var(--muted)', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10
        }}>
          Select Outreach Type
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
          gap: 10
        }}>
          {OUTREACH_TYPES.map(type => (
            <button
              key={type.key}
              onClick={() => setOutreachType(type.key)}
              style={{
                padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                cursor: 'pointer', transition: 'all 0.15s',
                background: outreachType === type.key
                  ? `${type.color}18`
                  : 'var(--surface)',
                border: outreachType === type.key
                  ? `1px solid ${type.color}55`
                  : '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{type.icon}</div>
              <div style={{
                fontSize: 13, fontWeight: 600, marginBottom: 3,
                color: outreachType === type.key ? type.color : 'var(--text)'
              }}>
                {type.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>
                {type.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* input card */}
      <div className="card" style={{ padding: 28, marginBottom: 24 }}>

        {/* target details */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 12, color: 'var(--muted)', fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10
          }}>
            Target Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{
                fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6
              }}>
                Company Name *
              </label>
              <input
                style={{
                  width: '100%', background: 'var(--surface2)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text)', fontFamily: 'DM Sans',
                  fontSize: 14, padding: '10px 14px', outline: 'none'
                }}
                placeholder="e.g. Google, Razorpay..."
                value={targetCompany}
                onChange={e => setTargetCompany(e.target.value)}
              />
            </div>
            <div>
              <label style={{
                fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6
              }}>
                Their Name (optional)
              </label>
              <input
                style={{
                  width: '100%', background: 'var(--surface2)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text)', fontFamily: 'DM Sans',
                  fontSize: 14, padding: '10px 14px', outline: 'none'
                }}
                placeholder="e.g. Priya Sharma"
                value={targetName}
                onChange={e => setTargetName(e.target.value)}
              />
            </div>
            <div>
              <label style={{
                fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6
              }}>
                Their Role (optional)
              </label>
              <input
                style={{
                  width: '100%', background: 'var(--surface2)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text)', fontFamily: 'DM Sans',
                  fontSize: 14, padding: '10px 14px', outline: 'none'
                }}
                placeholder="e.g. Engineering Manager, HR Recruiter"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
              />
            </div>
            <div>
              <label style={{
                fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6
              }}>
                Role You Are Applying For (optional)
              </label>
              <input
                style={{
                  width: '100%', background: 'var(--surface2)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text)', fontFamily: 'DM Sans',
                  fontSize: 14, padding: '10px 14px', outline: 'none'
                }}
                placeholder="e.g. Backend Engineer"
                value={applyingRole}
                onChange={e => setApplyingRole(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* resume upload */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 12, color: 'var(--muted)', fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10
          }}>
            Upload Resume for Personalization (optional)
          </div>
          <FileUpload
            onFileSelect={setFile}
            label="Upload Resume PDF — makes messages more personal"
          />
        </div>

        <button
          className="btn-primary"
          onClick={run}
          disabled={!targetCompany.trim() || loading}
        >
          {loading
            ? `⏳ Generating ${currentType?.label} messages...`
            : `${currentType?.icon} Generate ${currentType?.label} Messages`
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

      {/* results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* meta info */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Company</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{result.target_company}</div>
              </div>
              {result.target_name && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Contact</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{result.target_name}</div>
                </div>
              )}
              {result.applying_role && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Applying For</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{result.applying_role}</div>
                </div>
              )}
              <div style={{ marginLeft: 'auto' }}>
                <div style={{
                  padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                  background: 'rgba(108,71,255,0.15)',
                  border: '1px solid rgba(108,71,255,0.3)',
                  color: '#b89ffe'
                }}>
                  🕐 {result.best_time_to_send}
                </div>
              </div>
            </div>
          </div>

          {/* variant selector */}
          <div style={{ display: 'flex', gap: 8 }}>
            {result.variants?.map((v, i) => (
              <button
                key={i}
                onClick={() => setActiveVariant(i)}
                style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 13,
                  fontWeight: activeVariant === i ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: activeVariant === i
                    ? `${TONE_COLORS[v.tone] || '#6c47ff'}22`
                    : 'var(--surface)',
                  border: activeVariant === i
                    ? `1px solid ${TONE_COLORS[v.tone] || '#6c47ff'}55`
                    : '1px solid var(--border)',
                  color: activeVariant === i
                    ? (TONE_COLORS[v.tone] || '#b89ffe')
                    : 'var(--muted)'
                }}
              >
                {v.tone}
              </button>
            ))}
          </div>

          {/* active message */}
          {result.variants?.[activeVariant] && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 100,
                    fontWeight: 600, letterSpacing: '0.04em',
                    background: `${TONE_COLORS[result.variants[activeVariant].tone] || '#6c47ff'}22`,
                    color: TONE_COLORS[result.variants[activeVariant].tone] || '#b89ffe',
                    border: `1px solid ${TONE_COLORS[result.variants[activeVariant].tone] || '#6c47ff'}44`
                  }}>
                    {result.variants[activeVariant].tone}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 10 }}>
                    {result.variants[activeVariant].word_count} words
                  </span>
                </div>
                <button
                  onClick={() => copyText(
                    (result.variants[activeVariant].subject
                      ? `Subject: ${result.variants[activeVariant].subject}\n\n`
                      : '') + result.variants[activeVariant].message
                  )}
                  style={{
                    background: copied ? 'rgba(62,207,142,0.15)' : 'rgba(108,71,255,0.15)',
                    border: `1px solid ${copied ? 'rgba(62,207,142,0.3)' : 'rgba(108,71,255,0.3)'}`,
                    color: copied ? '#3ecf8e' : '#b89ffe',
                    padding: '8px 18px', borderRadius: 8,
                    fontSize: 13, fontWeight: 500, cursor: 'pointer'
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy Message'}
                </button>
              </div>

              {/* subject line for emails */}
              {result.variants[activeVariant].subject && (
                <div style={{
                  padding: '10px 14px', marginBottom: 16,
                  background: 'var(--surface2)', borderRadius: 8,
                  borderLeft: '3px solid rgba(108,71,255,0.5)'
                }}>
                  <span style={{ fontSize: 11, color: 'var(--muted)', marginRight: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Subject:
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>
                    {result.variants[activeVariant].subject}
                  </span>
                </div>
              )}

              {/* message body */}
              <div style={{
                fontSize: 14, color: 'var(--text)', lineHeight: 2,
                whiteSpace: 'pre-wrap', fontWeight: 300,
                background: 'var(--surface2)', borderRadius: 12,
                padding: '20px', marginBottom: 16
              }}>
                {result.variants[activeVariant].message}
              </div>

              {/* why it works */}
              <div style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                padding: '10px 14px',
                background: 'rgba(62,207,142,0.06)',
                border: '1px solid rgba(62,207,142,0.15)',
                borderRadius: 8
              }}>
                <span style={{ color: '#3ecf8e', fontSize: 13, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text)' }}>Why this works: </strong>
                  {result.variants[activeVariant].why_it_works}
                </span>
              </div>
            </div>
          )}

          {/* follow up */}
          {result.follow_up_message && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                    🔄 Follow-up Message
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 300 }}>
                    Send this after 5-7 days if no reply
                  </p>
                </div>
                <button
                  onClick={() => copyText(result.follow_up_message, true)}
                  style={{
                    background: copiedFollowUp ? 'rgba(62,207,142,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${copiedFollowUp ? 'rgba(62,207,142,0.3)' : 'var(--border)'}`,
                    color: copiedFollowUp ? '#3ecf8e' : 'var(--muted)',
                    padding: '6px 14px', borderRadius: 8,
                    fontSize: 12, cursor: 'pointer'
                  }}
                >
                  {copiedFollowUp ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div style={{
                fontSize: 13, color: 'var(--text)', lineHeight: 1.9,
                whiteSpace: 'pre-wrap', fontWeight: 300,
                background: 'var(--surface2)', borderRadius: 10, padding: '16px'
              }}>
                {result.follow_up_message}
              </div>
            </div>
          )}

          {/* dos and donts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#3ecf8e' }}>
                ✅ Do This
              </h3>
              {result.dos?.map((d, i) => (
                <div key={i} style={{
                  fontSize: 13, color: 'var(--muted)', marginBottom: 10,
                  paddingLeft: 12, lineHeight: 1.6,
                  borderLeft: '2px solid rgba(62,207,142,0.3)'
                }}>{d}</div>
              ))}
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#ff4d8d' }}>
                ❌ Avoid This
              </h3>
              {result.donts?.map((d, i) => (
                <div key={i} style={{
                  fontSize: 13, color: 'var(--muted)', marginBottom: 10,
                  paddingLeft: 12, lineHeight: 1.6,
                  borderLeft: '2px solid rgba(255,77,141,0.3)'
                }}>{d}</div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}