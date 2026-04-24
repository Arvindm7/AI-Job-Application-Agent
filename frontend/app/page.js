'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const stats = [
  { value: '6+', label: 'AI Agents' },
  { value: '30s', label: 'Avg Response' },
  { value: '100%', label: 'Free to Use' },
  { value: '∞', label: 'Applications' },
]

const steps = [
  {
    number: '01',
    title: 'Upload your resume',
    desc: 'Drop your PDF once — every feature uses it automatically.',
    icon: '📄'
  },
  {
    number: '02',
    title: 'Pick what you need',
    desc: 'ATS check, tailored resume, cover letter, interview prep and more.',
    icon: '⚡'
  },
  {
    number: '03',
    title: 'Get results in seconds',
    desc: 'AI agents work in parallel — full application pack in under 60 seconds.',
    icon: '🚀'
  },
]

const problems = [
  { problem: 'Spending hours tailoring resume for each job', solution: 'AI tailors it in 30 seconds' },
  { problem: 'Not knowing why you get rejected by ATS', solution: 'Get exact score and fixes' },
  { problem: 'Blank page when writing cover letters', solution: 'Personalized draft instantly' },
  { problem: 'Going into interviews unprepared', solution: 'Full prep kit with study plan' },
  { problem: 'Not knowing what to say about the company', solution: 'Deep company research brief' },
  { problem: 'Cold emails getting ignored', solution: '3 proven variants that get replies' },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)'
      }}>
        <span style={{
          fontFamily: 'Bricolage Grotesque', fontSize: 22,
          fontWeight: 800, color: 'var(--text)'
        }}>
          Job<span style={{ color: '#6c47ff' }}>Agent</span>
          <span style={{
            fontSize: 10, background: 'rgba(108,71,255,0.2)',
            color: '#b89ffe', padding: '2px 6px',
            borderRadius: 4, marginLeft: 6, fontWeight: 500,
            verticalAlign: 'middle', letterSpacing: '0.05em'
          }}>AI</span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dashboard" style={{
            background: 'linear-gradient(135deg, #6c47ff, #ff4d8d)',
            color: 'white', padding: '9px 22px', borderRadius: 10,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            fontFamily: 'Bricolage Grotesque'
          }}>
            Get Started Free →
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section style={{
        textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative'
      }}>
        {/* background glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(108,71,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(108,71,255,0.12)',
          border: '1px solid rgba(108,71,255,0.25)',
          color: '#b89ffe', fontSize: 12, fontWeight: 500,
          padding: '6px 16px', borderRadius: 100, marginBottom: 28,
          letterSpacing: '0.04em'
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#6c47ff', animation: 'pulse 2s infinite'
          }} />
          AI Powered · Built with FastAPI + Next.js
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20 }}>
          <span className="gradient-text">Land Your Dream Job</span>
          <br />
          <span style={{ color: 'var(--text)' }}>With AI on Your Side</span>
        </h1>

        <p style={{
          color: 'var(--muted)', fontSize: 19,
          maxWidth: 560, margin: '0 auto 48px',
          lineHeight: 1.7, fontWeight: 300
        }}>
          6 AI agents working together — ATS optimization, tailored resumes,
          cover letters, interview prep, company research and cold outreach.
          Everything you need to land your dream job.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #6c47ff, #ff4d8d)',
            color: 'white', padding: '16px 36px', borderRadius: 14,
            fontFamily: 'Bricolage Grotesque', fontWeight: 700,
            fontSize: 17, textDecoration: 'none'
          }}>
            ⚡ Launch Job Agent
          </Link>
          <Link href="/pipeline" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            color: 'var(--text)', padding: '16px 36px', borderRadius: 14,
            fontFamily: 'Bricolage Grotesque', fontWeight: 600,
            fontSize: 17, textDecoration: 'none'
          }}>
            Run All Agents →
          </Link>
        </div>

        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16, fontWeight: 300 }}>
          No signup required · Free to use · Results in seconds
        </p>
      </section>

      {/* stats */}
      <section style={{
        maxWidth: 800, margin: '0 auto',
        padding: '0 24px 80px',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '28px 16px',
            background: 'var(--surface)',
            borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            borderLeft: i === 0 ? '1px solid var(--border)' : 'none',
            borderRadius: i === 0 ? '12px 0 0 12px' : i === 3 ? '0 12px 12px 0' : '0'
          }}>
            <div style={{
              fontSize: 32, fontWeight: 800,
              fontFamily: 'Bricolage Grotesque',
              background: 'linear-gradient(135deg, #b89ffe, #ff4d8d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* problem → solution */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 24px 100px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 12 }}>
            Every Job Hunt Problem. <span className="gradient-text">Solved.</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, fontWeight: 300 }}>
            Real problems job seekers face — and exactly how Job Agent fixes them.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {problems.map((p, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center', gap: 16,
              padding: '18px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              transition: 'border-color 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,71,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, color: '#ff4d8d', flexShrink: 0 }}>✗</span>
                <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300 }}>{p.problem}</span>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(108,71,255,0.15)',
                border: '1px solid rgba(108,71,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#b89ffe', flexShrink: 0
              }}>→</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, color: '#3ecf8e', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{p.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 24px 100px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 12 }}>
            How It Works
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, fontWeight: 300 }}>
            Three steps from resume to job ready.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16
        }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              padding: 28,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 12, right: 16,
                fontSize: 56, fontWeight: 800,
                color: 'rgba(108,71,255,0.08)',
                fontFamily: 'Bricolage Grotesque', lineHeight: 1
              }}>{s.number}</div>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section style={{
        maxWidth: 700, margin: '0 auto',
        padding: '0 24px 120px', textAlign: 'center'
      }}>
        <div style={{
          padding: '60px 48px',
          background: 'linear-gradient(135deg, rgba(108,71,255,0.12), rgba(255,77,141,0.08))',
          border: '1px solid rgba(108,71,255,0.2)',
          borderRadius: 24
        }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
            Ready to Land Your Dream Job?
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32, fontWeight: 300, lineHeight: 1.7 }}>
            Join thousands of job seekers using AI to get more interviews,
            better offers and less rejection.
          </p>
          <Link href="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #6c47ff, #ff4d8d)',
            color: 'white', padding: '16px 40px', borderRadius: 14,
            fontFamily: 'Bricolage Grotesque', fontWeight: 700,
            fontSize: 17, textDecoration: 'none'
          }}>
            ⚡ Start for Free — No Signup
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.7); }
        }
        @media (max-width: 600px) {
          nav { padding: 16px 20px !important; }
        }
      `}</style>
    </main>
  )
}