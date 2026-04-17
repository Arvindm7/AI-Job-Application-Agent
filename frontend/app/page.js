'use client'
import Link from 'next/link'

const features = [
  { icon: '🎯', title: 'ATS Analyzer', desc: 'Check your resume score instantly', href: '/ats-check' },
  { icon: '✏️', title: 'Resume Tailor', desc: 'Get LaTeX resume optimized for any job', href: '/tailor_resume' },
  { icon: '📨', title: 'Cover Letter', desc: 'Personalized cover letter in seconds', href: '/cover_letter' },
  { icon: '🤝', title: 'Job Match', desc: 'Find jobs that match your profile', href: '/jobs_search' },
  { icon: '🎤', title: 'Interview Prep', desc: 'Questions, plan and resources', href: '/interview_prep' },
  { icon: '📊', title: 'Resume Match', desc: 'Score your resume vs any job', href: '/analyze_resume' },
]


export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid var(--border)'
      }}>
        <span style={{
          fontFamily: 'Bricolage Grotesque', fontSize: 20, fontWeight: 700, color: 'var(--text)'
        }}>
          Job<span style={{ color: '#6c47ff' }}>Agent</span>
        </span>
        <Link href="/dashboard" style={{
          background: 'rgba(108,71,255,0.15)', border: '1px solid rgba(108,71,255,0.3)',
          color: '#b89ffe', padding: '8px 20px', borderRadius: 100,
          fontSize: 14, fontWeight: 500, textDecoration: 'none'
        }}>
          Get Started →
        </Link>
      </nav>

      {/* hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 60px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(108,71,255,0.12)', border: '1px solid rgba(108,71,255,0.25)',
          color: '#b89ffe', fontSize: 12, fontWeight: 500, padding: '5px 14px',
          borderRadius: 100, marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase'
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#6c47ff',
            animation: 'pulse 2s infinite'
          }}/>
          AI Powered · Built with FastAPI + Next.js
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20 }}>
          <span className="gradient-text">Land Your Dream Job</span>
          <br />
          <span style={{ color: 'var(--text)' }}>With AI on Your Side</span>
        </h1>

        <p style={{ color: 'var(--muted)', fontSize: 18, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 300 }}>
          Upload your resume once. Get ATS scores, tailored resumes, cover letters,
          matched jobs and full interview prep — all in one place.
        </p>

        <Link href="/dashboard" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #6c47ff, #ff4d8d)', 
          color: 'white', padding: '16px 40px', borderRadius: 14,
          fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16,
          textDecoration: 'none'
        }}>
          Start for Free ⚡
        </Link>
      </section>

      {/* features grid */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16
        }}>
          {features.map(f => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <FeatureCard feature={f} />
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.8); }
        }
      `}</style>
    </main>
  )
}

// separate component for hover effects
function FeatureCard({ feature: f }) {
  return (
    <div
      className="card"
      style={{ padding: 24, cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(108,71,255,0.4)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>{f.title}</h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300 }}>{f.desc}</p>
    </div>
  )
}