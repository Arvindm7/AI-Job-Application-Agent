'use client'
import { useState, useEffect } from 'react'
import { resumeStore } from '@/lib/resumeStore'

export default function ResumeStatus() {
  const [meta, setMeta] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setMeta(resumeStore.getMeta())

    // listen for storage changes
    const handleStorage = () => setMeta(resumeStore.getMeta())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // refresh every minute for "saved X ago" text
  useEffect(() => {
    const interval = setInterval(() => {
      if (resumeStore.exists()) setMeta(resumeStore.getMeta())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  if (!meta) {
    return (
      <div style={{
        padding: '10px 12px',
        background: 'rgba(255,77,141,0.08)',
        border: '1px solid rgba(255,77,141,0.15)',
        borderRadius: 10, marginBottom: 12
      }}>
        <div style={{ fontSize: 11, color: '#ff4d8d', fontWeight: 500, marginBottom: 2 }}>
          ⚠️ No resume saved
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 300 }}>
          Upload your PDF on any page
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '10px 12px',
      background: 'rgba(62,207,142,0.06)',
      border: '1px solid rgba(62,207,142,0.15)',
      borderRadius: 10, marginBottom: 12
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 2
      }}>
        <div style={{ fontSize: 11, color: '#3ecf8e', fontWeight: 500 }}>
          💾 Resume saved
        </div>
        <button
          onClick={() => {
            resumeStore.clear()
            setMeta(null)
          }}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--muted)', fontSize: 10,
            cursor: 'pointer', padding: 0
          }}
          onMouseEnter={e => e.target.style.color = '#ff4d8d'}
          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
        >
          ✕
        </button>
      </div>
      <div style={{
        fontSize: 10, color: 'var(--muted)',
        fontWeight: 300, overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>
        {meta.name}
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
        {resumeStore.savedAgo()}
      </div>
    </div>
  )
}