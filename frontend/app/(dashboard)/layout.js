'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: '📊', label: 'Resume Match', href: '/analyze_resume' },
  { icon: '🎯', label: 'ATS Check', href: '/ats-check' },
  { icon: '✏️', label: 'Tailor Resume', href: '/tailor_resume' },
  { icon: '📨', label: 'Cover Letter', href: '/cover_letter' },
  { icon: '🎤', label: 'Interview Prep', href: '/interview_prep' },
  { icon: '🤝', label: 'Find Jobs', href: '/jobs_search' },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      <aside style={{
        width: 240, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        padding: '24px 16px',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto'
      }}>
        <Link href="/" style={{ textDecoration: 'none', marginBottom: 32, display: 'block' }}>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontSize: 20, fontWeight: 700 }}>
            Job<span style={{ color: '#6c47ff' }}>Agent</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
                  background: active ? 'rgba(108,71,255,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(108,71,255,0.3)' : '1px solid transparent',
                  color: active ? '#b89ffe' : 'var(--muted)',
                  fontSize: 14, fontWeight: active ? 500 : 400,
                  transition: 'all 0.15s', cursor: 'pointer'
                }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <div style={{
            background: 'rgba(108,71,255,0.1)',
            border: '1px solid rgba(108,71,255,0.2)',
            borderRadius: 10, padding: '12px 14px'
          }}>
            <p style={{ fontSize: 12, color: '#b89ffe', fontWeight: 500, marginBottom: 4 }}>
              ⚡ AI Agent Active
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 300 }}>
              Powered by Cerebras LLM
            </p>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}