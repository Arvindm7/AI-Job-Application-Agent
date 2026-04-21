'use client'
import Link from 'next/link'

const features = [
  {
    icon: '🎯', title: 'ATS Health Check', href: '/ats-check',
    desc: 'Check how well your resume performs with ATS systems',
    time: '~30 seconds', color: '#6c47ff'
  },
  {
    icon: '📊', title: 'Resume Match', href: '/analyze_resume',
    desc: 'See how well your resume matches a specific job description',
    time: '~45 seconds', color: '#ff4d8d'
  },
  {
    icon: '✏️', title: 'Tailor Resume', href: '/tailor_resume',
    desc: 'Get an ATS optimized LaTeX resume for any job',
    time: '~60 seconds', color: '#3ecf8e'
  },
  {
    icon: '📨', title: 'Cover Letter', href: '/cover_letter',
    desc: 'Generate a personalized cover letter instantly',
    time: '~45 seconds', color: '#f9a825'
  },
  {
    icon: '🎤', title: 'Interview Prep', href: '/interview_prep',
    desc: 'Get questions, study plan and resources to ace interviews',
    time: '~90 seconds', color: '#b89ffe'
  },
  {
    icon: '🤝', title: 'Find Jobs', href: '/jobs_search',
    desc: 'AI matches your resume to real job postings',
    time: '~60 seconds', color: '#3ecf8e'
  },
  {
    icon: '🕵️', title: 'Company Research', href: '/company',
    desc: 'Get insider information about any company',
    time: '~45 seconds', color: '#ff4d8d'
  },
  {
    icon: '⚡', title: 'One-Click Pipeline', href: '/pipeline',
    desc: 'Run all optimizations in one go and get a complete package',
    time: '~2 minutes', color: '#6c47ff'
  }
]

const steps = [
  { step: '01', title: 'Upload your resume', desc: 'PDF format, any resume works' },
  { step: '02', title: 'Choose a feature', desc: 'Pick what you need right now' },
  { step: '03', title: 'Get results instantly', desc: 'AI analyzes in seconds' },
]

export default function Dashboard() {
  return (
    <div>
      {/* welcome */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Welcome to <span className="gradient-text">Job Agent</span> 👋
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, fontWeight: 300, lineHeight: 1.6 }}>
          Your AI-powered job hunting assistant. Pick any feature below to get started — all you need is your resume PDF.
        </p>
      </div>

      {/* how it works */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            flex: 1, minWidth: 160,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14, padding: '20px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              fontSize: 48, fontWeight: 800, color: 'rgba(108,71,255,0.1)',
              position: 'absolute', top: 8, right: 12,
              fontFamily: 'Bricolage Grotesque', lineHeight: 1
            }}>
              {s.step}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#b89ffe', marginBottom: 6 }}>
              Step {s.step}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* feature cards */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Choose a feature to start</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 14
      }}>
        {features.map(f => (
          <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14, padding: 22,
              cursor: 'pointer', transition: 'all 0.2s',
              height: '100%'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = f.color + '66'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.5, marginBottom: 14 }}>
                {f.desc}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, color: f.color,
                background: f.color + '18',
                padding: '3px 10px', borderRadius: 100
              }}>
                ⚡ {f.time}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}