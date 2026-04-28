const RESUME_KEY = 'job_agent_resume'
const RESUME_META_KEY = 'job_agent_resume_meta'

export const resumeStore = {

  // save resume file as base64 + metadata
  save: async (file) => {
    if (file.size > 4 * 1024 * 1024) {
    console.warn('Resume file is large — may not fit in localStorage')
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const base64 = reader.result
          localStorage.setItem(RESUME_KEY, base64)
          localStorage.setItem(RESUME_META_KEY, JSON.stringify({
            name: file.name,
            size: file.size,
            savedAt: new Date().toISOString(),
            type: file.type
          }))
          resolve(true)
        } catch (e) {
          // localStorage full
          reject(e)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  // get resume as File object
  getFile: () => {
    try {
      const base64 = localStorage.getItem(RESUME_KEY)
      const meta = resumeStore.getMeta()
      if (!base64 || !meta) return null

      // convert base64 back to File
      const arr = base64.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) u8arr[n] = bstr.charCodeAt(n)
      return new File([u8arr], meta.name, { type: mime })
    } catch (e) {
      return null
    }
  },

  // get metadata only
  getMeta: () => {
    try {
      const meta = localStorage.getItem(RESUME_META_KEY)
      return meta ? JSON.parse(meta) : null
    } catch (e) {
      return null
    }
  },

  // check if resume exists
  exists: () => {
    return !!localStorage.getItem(RESUME_KEY) && !!localStorage.getItem(RESUME_META_KEY)
  },

  // clear resume
  clear: () => {
    localStorage.removeItem(RESUME_KEY)
    localStorage.removeItem(RESUME_META_KEY)
  },

  // get how long ago it was saved
  savedAgo: () => {
    const meta = resumeStore.getMeta()
    if (!meta) return ''
    const diff = Date.now() - new Date(meta.savedAt).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (mins > 0) return `${mins} minute${mins > 1 ? 's' : ''} ago`
    return 'just now'
  }
}