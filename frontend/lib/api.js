import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
})

// helper to build multipart form with file + text fields
const formData = (file, fields = {}) => {
  const fd = new FormData()
  if (file) fd.append('file', file)
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v))
  return fd
}

export const apiClient = {

  // resume
  parsePDF: (file) =>
    api.post('/resume/parse', formData(file)),

  // analyze
  analyzeResume: (file, job_description) =>
    api.post('/analyze/resume', formData(file, { job_description })),

  atsCheck: (file) =>
    api.post('/analyze/ats-check', formData(file)),

  // tailor
  tailorLatex: (file, job_description) =>
    api.post('/tailor/resume/latex', formData(file, { job_description }), {
      responseType: 'text'
    }),

  // cover letter
  generateCoverLetter: (file, job_description) =>
    api.post('/cover-letter/generate', formData(file, { job_description })),

  // interview
  interviewPrep: (file, job_description) =>
    api.post('/interview/prepare', formData(file, { job_description })),

  // jobs
  matchJobs: (file, location = 'India', remote_only = false) =>
    api.post('/jobs/match', formData(file, { location, remote_only })),

  searchJobs: (query, location = 'India', remote_only = false) =>
    api.get('/jobs/search', { params: { query, location, remote_only } }),
}