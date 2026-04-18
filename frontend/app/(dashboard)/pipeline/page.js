'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import { apiClient } from '@/lib/api'

const AGENTS = [
    { key: 'ats_check', label: 'ATS Health Check', icon: '🎯', color: '#6c47ff' },
    { key: 'match_analysis', label: 'Resume Match', icon: '📊', color: '#ff4d8d' },
    { key: 'latex_resume', label: 'Tailored Resume', icon: '✏️', color: '#3ecf8e' },
    { key: 'cover_letter', label: 'Cover Letter', icon: '📨', color: '#f9a825' },
    { key: 'interview_prep', label: 'Interview Prep', icon: '🎤', color: '#b89ffe' },
]

export default function Pipeline() {
    const [file, setFile] = useState(null)
    const [jd, setJd] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [activeAgent, setActiveAgent] = useState(null)
    const [copied, setCopied] = useState(false)
    const [exporting, setExporting] = useState(false)

    const run = async () => {
        if (!file || !jd) return
        setLoading(true); setError(''); setResult(null); setActiveAgent(null)
        try {
            const res = await apiClient.runPipeline(file, jd)
            setResult(res.data)
            setActiveAgent('ats_check')
        } catch (e) {
            setError(e.response?.data?.detail || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const copy = async (text) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const scoreColor = (score) => {
        if (score >= 75) return '#3ecf8e'
        if (score >= 50) return '#f9a825'
        return '#ff4d8d'
    }

    // add this function with your other functions
    const exportPackage = async () => {
        if (!result) return
        setExporting(true)
        try {
            const res = await apiClient.exportPackage(result)

            // create download link and trigger it
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'job_application_package.zip')
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (e) {
            setError('Export failed. Try again.')
        } finally {
            setExporting(false)
        }
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
                    <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#6c47ff', animation: 'pulse 2s infinite'
                    }} />
                    Multi-Agent Pipeline
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                    Run All Agents at Once
                </h1>
                <p style={{ color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6 }}>
                    Upload your resume and job description — all 5 AI agents run in parallel
                    and deliver a complete job application package in one shot.
                </p>
            </div>

            {/* agent preview pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {AGENTS.map(a => (
                    <div key={a.key} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 100, fontSize: 12,
                        background: loading ? 'rgba(255,255,255,0.04)' : result ? 'rgba(62,207,142,0.1)' : 'var(--surface)',
                        border: `1px solid ${loading ? a.color + '44' : result ? 'rgba(62,207,142,0.2)' : 'var(--border)'}`,
                        color: loading ? a.color : result ? '#3ecf8e' : 'var(--muted)',
                        transition: 'all 0.3s'
                    }}>
                        {loading && (
                            <span style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: a.color,
                                animation: 'pulse 1.5s infinite',
                                animationDelay: `${AGENTS.indexOf(a) * 0.2}s`
                            }} />
                        )}
                        {result && !result[a.key]?.failed && (
                            <span style={{ color: '#3ecf8e', fontSize: 10 }}>✓</span>
                        )}
                        {a.icon} {a.label}
                    </div>
                ))}
            </div>

            {/* input card */}
            <div className="card" style={{ padding: 28, marginBottom: 24 }}>
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
                    style={{ marginTop: 16, fontSize: 16, padding: '16px 24px' }}
                    onClick={run}
                    disabled={!file || !jd || loading}
                >
                    {loading
                        ? '⏳ All agents running in parallel...'
                        : '⚡ Launch All Agents'}
                </button>
                {loading && (
                    <div style={{
                        marginTop: 14, padding: '12px 16px',
                        background: 'rgba(108,71,255,0.08)',
                        border: '1px solid rgba(108,71,255,0.2)',
                        borderRadius: 10, fontSize: 13, color: '#b89ffe'
                    }}>
                        🤖 5 AI agents are working simultaneously — ATS check, match analysis,
                        resume tailoring, cover letter and interview prep all running at once.
                        This takes about 30–60 seconds...
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

            {/* results */}
            {result && (
                <div>

                    {/* summary score bar */}
                    <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
                            🎉 Pipeline Complete — All Agents Done
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                            {result.ats_check && !result.ats_check.failed && (
                                <div style={{
                                    textAlign: 'center', padding: '16px 12px',
                                    background: 'var(--surface2)', borderRadius: 12
                                }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(result.ats_check.ats_score), fontFamily: 'Bricolage Grotesque' }}>
                                        {result.ats_check.ats_score}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>ATS Score</div>
                                </div>
                            )}
                            {result.match_analysis && !result.match_analysis.failed && (
                                <div style={{
                                    textAlign: 'center', padding: '16px 12px',
                                    background: 'var(--surface2)', borderRadius: 12
                                }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(result.match_analysis.match_score), fontFamily: 'Bricolage Grotesque' }}>
                                        {result.match_analysis.match_score}%
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Job Match</div>
                                </div>
                            )}
                            {result.cover_letter && !result.cover_letter.failed && (
                                <div style={{
                                    textAlign: 'center', padding: '16px 12px',
                                    background: 'var(--surface2)', borderRadius: 12
                                }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: '#3ecf8e', fontFamily: 'Bricolage Grotesque' }}>
                                        {result.cover_letter.word_count}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Cover Letter Words</div>
                                </div>
                            )}
                            {result.interview_prep && !result.interview_prep.failed && (
                                <div style={{
                                    textAlign: 'center', padding: '16px 12px',
                                    background: 'var(--surface2)', borderRadius: 12
                                }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: '#b89ffe', fontFamily: 'Bricolage Grotesque' }}>
                                        {result.interview_prep.total_prep_days}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Prep Days</div>
                                </div>
                            )}
                            {result.latex_resume && !result.latex_resume.failed && (
                                <div style={{
                                    textAlign: 'center', padding: '16px 12px',
                                    background: 'var(--surface2)', borderRadius: 12
                                }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: '#f9a825', fontFamily: 'Bricolage Grotesque' }}>
                                        ✓
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Resume Ready</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* export banner */}
                    {result && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(108,71,255,0.15), rgba(255,77,141,0.1))',
                            border: '1px solid rgba(108,71,255,0.3)',
                            borderRadius: 16, padding: '20px 24px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 20, flexWrap: 'wrap', gap: 16
                        }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                                    📦 Your Job Application Package is Ready
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>
                                    Download a ZIP with your tailored resume, cover letter,
                                    ATS report, match analysis and interview prep — all in one file.
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                    {[
                                        'resume.tex',
                                        'cover_letter.txt',
                                        'ats_report.pdf',
                                        'match_report.pdf',
                                        'interview_prep.pdf',
                                        'interview_questions.txt',
                                        'README.pdf'
                                    ].map(f => (
                                        <span key={f} style={{
                                            fontSize: 11, padding: '2px 10px', borderRadius: 100,
                                            background: 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'var(--muted)'
                                        }}>{f}</span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={exportPackage}
                                disabled={exporting}
                                style={{
                                    background: 'linear-gradient(135deg, #6c47ff, #ff4d8d)',
                                    color: 'white', border: 'none',
                                    padding: '14px 28px', borderRadius: 12,
                                    fontFamily: 'Bricolage Grotesque',
                                    fontWeight: 700, fontSize: 15,
                                    cursor: exporting ? 'not-allowed' : 'pointer',
                                    opacity: exporting ? 0.6 : 1,
                                    whiteSpace: 'nowrap', flexShrink: 0
                                }}
                            >
                                {exporting ? '⏳ Preparing...' : '⬇️ Download Package'}
                            </button>
                        </div>
                    )}

                    {/* agent selector tabs */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                        {AGENTS.map(a => (
                            <button key={a.key} onClick={() => setActiveAgent(a.key)} style={{
                                padding: '10px 18px', borderRadius: 10, fontSize: 13,
                                fontWeight: activeAgent === a.key ? 600 : 400,
                                background: activeAgent === a.key ? a.color + '22' : 'var(--surface)',
                                border: activeAgent === a.key ? `1px solid ${a.color}66` : '1px solid var(--border)',
                                color: activeAgent === a.key ? a.color : 'var(--muted)',
                                cursor: 'pointer', transition: 'all 0.15s',
                                opacity: result[a.key]?.failed ? 0.4 : 1
                            }}>
                                {a.icon} {a.label}
                                {result[a.key]?.failed && ' ⚠️'}
                            </button>
                        ))}
                    </div>

                    {/* agent result panels */}
                    <div className="card" style={{ padding: 28 }}>

                        {/* ATS Check */}
                        {activeAgent === 'ats_check' && result.ats_check && (
                            <div>
                                {result.ats_check.failed ? (
                                    <p style={{ color: '#ff4d8d' }}>⚠️ {result.ats_check.error}</p>
                                ) : (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                                            <div style={{
                                                fontSize: 56, fontWeight: 800,
                                                color: scoreColor(result.ats_check.ats_score),
                                                fontFamily: 'Bricolage Grotesque', lineHeight: 1
                                            }}>
                                                {result.ats_check.ats_score}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                                                    {result.ats_check.verdict}
                                                </div>
                                                <span style={{
                                                    fontSize: 11, padding: '3px 10px', borderRadius: 100,
                                                    background: result.ats_check.keyword_density === 'high'
                                                        ? 'rgba(62,207,142,0.15)' : 'rgba(249,168,37,0.15)',
                                                    color: result.ats_check.keyword_density === 'high' ? '#3ecf8e' : '#f9a825'
                                                }}>
                                                    Keyword density: {result.ats_check.keyword_density}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                            <div>
                                                <h4 style={{ fontSize: 13, color: '#ff4d8d', marginBottom: 10 }}>❌ Issues</h4>
                                                {result.ats_check.issues_found.map((issue, i) => (
                                                    <div key={i} style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid rgba(255,77,141,0.3)', lineHeight: 1.5 }}>{issue}</div>
                                                ))}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: 13, color: '#3ecf8e', marginBottom: 10 }}>✅ Improvements</h4>
                                                {result.ats_check.improvements.map((imp, i) => (
                                                    <div key={i} style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid rgba(62,207,142,0.3)', lineHeight: 1.5 }}>{imp}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: 13, color: '#b89ffe', marginBottom: 10 }}>💡 Tips</h4>
                                            {result.ats_check.overall_tips.map((tip, i) => (
                                                <div key={i} style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid rgba(108,71,255,0.3)', lineHeight: 1.5 }}>{tip}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Match Analysis */}
                        {activeAgent === 'match_analysis' && result.match_analysis && (
                            <div>
                                {result.match_analysis.failed ? (
                                    <p style={{ color: '#ff4d8d' }}>⚠️ {result.match_analysis.error}</p>
                                ) : (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                                            <div style={{
                                                fontSize: 56, fontWeight: 800,
                                                color: scoreColor(result.match_analysis.match_score),
                                                fontFamily: 'Bricolage Grotesque', lineHeight: 1
                                            }}>
                                                {result.match_analysis.match_score}%
                                            </div>
                                            <div style={{ fontSize: 15, fontWeight: 600 }}>
                                                {result.match_analysis.verdict}
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                            <div>
                                                <h4 style={{ fontSize: 13, color: '#3ecf8e', marginBottom: 10 }}>✅ Matched Skills</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    {result.match_analysis.matched_skills.map((s, i) => (
                                                        <span key={i} style={{
                                                            padding: '3px 10px', borderRadius: 100, fontSize: 11,
                                                            background: 'rgba(62,207,142,0.15)', color: '#3ecf8e',
                                                            border: '1px solid rgba(62,207,142,0.2)'
                                                        }}>{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: 13, color: '#ff4d8d', marginBottom: 10 }}>❌ Missing Skills</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    {result.match_analysis.missing_skills.map((s, i) => (
                                                        <span key={i} style={{
                                                            padding: '3px 10px', borderRadius: 100, fontSize: 11,
                                                            background: 'rgba(255,77,141,0.15)', color: '#ff4d8d',
                                                            border: '1px solid rgba(255,77,141,0.2)'
                                                        }}>{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <div>
                                                <h4 style={{ fontSize: 13, color: '#b89ffe', marginBottom: 10 }}>💪 Strengths</h4>
                                                {result.match_analysis.strengths.map((s, i) => (
                                                    <div key={i} style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid rgba(108,71,255,0.3)', lineHeight: 1.5 }}>{s}</div>
                                                ))}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: 13, color: '#f9a825', marginBottom: 10 }}>⚠️ Gaps</h4>
                                                {result.match_analysis.gaps.map((g, i) => (
                                                    <div key={i} style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid rgba(249,168,37,0.3)', lineHeight: 1.5 }}>{g}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* LaTeX Resume */}
                        {activeAgent === 'latex_resume' && (
                            <div>
                                {result.latex_resume?.failed ? (
                                    <p style={{ color: '#ff4d8d' }}>⚠️ {result.latex_resume.error}</p>
                                ) : (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <h3 style={{ fontSize: 15, fontWeight: 700 }}>📄 ATS Optimized LaTeX Resume</h3>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <button onClick={() => copy(result.latex_resume)} style={{
                                                    background: copied ? 'rgba(62,207,142,0.15)' : 'rgba(108,71,255,0.15)',
                                                    border: `1px solid ${copied ? 'rgba(62,207,142,0.3)' : 'rgba(108,71,255,0.3)'}`,
                                                    color: copied ? '#3ecf8e' : '#b89ffe',
                                                    padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
                                                }}>
                                                    {copied ? '✓ Copied!' : 'Copy LaTeX'}
                                                </button>
                                                <a href="https://www.overleaf.com/project" target="_blank" rel="noreferrer" style={{
                                                    background: 'rgba(62,207,142,0.15)',
                                                    border: '1px solid rgba(62,207,142,0.3)',
                                                    color: '#3ecf8e', padding: '8px 16px',
                                                    borderRadius: 8, fontSize: 13, textDecoration: 'none'
                                                }}>
                                                    Open Overleaf →
                                                </a>
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'rgba(108,71,255,0.08)',
                                            border: '1px solid rgba(108,71,255,0.2)',
                                            borderRadius: 10, padding: '10px 14px', marginBottom: 14
                                        }}>
                                            <p style={{ fontSize: 12, color: '#b89ffe' }}>
                                                Copy → Open Overleaf → New Project → Blank → Paste → Recompile → Download PDF
                                            </p>
                                        </div>
                                        <pre style={{
                                            background: 'var(--surface2)', border: '1px solid var(--border)',
                                            borderRadius: 10, padding: 20, fontSize: 11, color: '#b89ffe',
                                            lineHeight: 1.7, overflowX: 'auto', maxHeight: 400,
                                            overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                                        }}>
                                            {result.latex_resume}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cover Letter */}
                        {activeAgent === 'cover_letter' && result.cover_letter && (
                            <div>
                                {result.cover_letter.failed ? (
                                    <p style={{ color: '#ff4d8d' }}>⚠️ {result.cover_letter.error}</p>
                                ) : (
                                    <div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                                            {[
                                                { label: 'Role', value: result.cover_letter.role_title },
                                                { label: 'Company', value: result.cover_letter.company_name },
                                                { label: 'Addressed To', value: result.cover_letter.hiring_manager },
                                            ].map((item, i) => (
                                                <div key={i} style={{ background: 'var(--surface2)', borderRadius: 10, padding: '12px 16px' }}>
                                                    <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{item.label}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{result.cover_letter.word_count} words</span>
                                            <button onClick={() => copy(result.cover_letter.cover_letter)} style={{
                                                background: copied ? 'rgba(62,207,142,0.15)' : 'rgba(108,71,255,0.15)',
                                                border: `1px solid ${copied ? 'rgba(62,207,142,0.3)' : 'rgba(108,71,255,0.3)'}`,
                                                color: copied ? '#3ecf8e' : '#b89ffe',
                                                padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
                                            }}>
                                                {copied ? '✓ Copied!' : 'Copy Letter'}
                                            </button>
                                        </div>
                                        <div style={{
                                            fontSize: 14, color: 'var(--muted)', lineHeight: 2,
                                            whiteSpace: 'pre-wrap', fontWeight: 300,
                                            background: 'var(--surface2)', borderRadius: 12,
                                            padding: 20
                                        }}>
                                            {result.cover_letter.cover_letter}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Interview Prep */}
                        {activeAgent === 'interview_prep' && result.interview_prep && (
                            <div>
                                {result.interview_prep.failed ? (
                                    <p style={{ color: '#ff4d8d' }}>⚠️ {result.interview_prep.error}</p>
                                ) : (
                                    <div>
                                        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                                            <div>
                                                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</div>
                                                <div style={{ fontSize: 15, fontWeight: 600 }}>{result.interview_prep.role_title}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</div>
                                                <div style={{ fontSize: 15, fontWeight: 600 }}>{result.interview_prep.company_name}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prep Time</div>
                                                <div style={{ fontSize: 15, fontWeight: 600, color: '#b89ffe' }}>{result.interview_prep.total_prep_days} days</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                            <div>
                                                <h4 style={{ fontSize: 13, color: '#b89ffe', marginBottom: 10 }}>🧠 Behavioral Questions</h4>
                                                {result.interview_prep.behavioral_questions.slice(0, 5).map((q, i) => (
                                                    <div key={i} style={{
                                                        padding: '10px 12px', marginBottom: 8,
                                                        background: 'var(--surface2)', borderRadius: 8,
                                                        fontSize: 13, color: 'var(--text)', lineHeight: 1.5
                                                    }}>
                                                        <span style={{ color: 'var(--muted)', fontSize: 11, marginRight: 6 }}>Q{i + 1}.</span>{q}
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: 13, color: '#ff4d8d', marginBottom: 10 }}>💻 Technical Questions</h4>
                                                {result.interview_prep.technical_questions.slice(0, 5).map((q, i) => (
                                                    <div key={i} style={{
                                                        padding: '10px 12px', marginBottom: 8,
                                                        background: 'var(--surface2)', borderRadius: 8,
                                                        fontSize: 13, color: 'var(--text)', lineHeight: 1.5
                                                    }}>
                                                        <span style={{ color: 'var(--muted)', fontSize: 11, marginRight: 6 }}>Q{i + 1}.</span>{q}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <h4 style={{ fontSize: 13, color: '#3ecf8e', marginBottom: 10 }}>📚 Study Plan</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {result.interview_prep.daily_plan.slice(0, 5).map((day, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', gap: 14, alignItems: 'flex-start',
                                                    padding: '12px 14px', background: 'var(--surface2)', borderRadius: 10
                                                }}>
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                        background: 'rgba(108,71,255,0.2)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 11, fontWeight: 700, color: '#b89ffe'
                                                    }}>
                                                        {day.day}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{day.focus}</div>
                                                        <div style={{ fontSize: 11, color: '#3ecf8e' }}>Goal: {day.goal}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            {result.interview_prep.daily_plan.length > 5 && (
                                                <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: '8px' }}>
                                                    + {result.interview_prep.daily_plan.length - 5} more days — visit Interview Prep page for full plan
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}

            <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.7); }
        }
      `}</style>
        </div>
    )
}