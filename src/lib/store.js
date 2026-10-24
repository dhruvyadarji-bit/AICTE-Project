import { INITIAL_COMPLAINTS } from '../data/mockData.js'

// localStorage persistence layer. Swap these three functions for API calls
// (fetch to /api/complaints) when a real backend is added — nothing else
// in the app needs to change.

const KEY = 'aicte-dashboard:complaints:v1'

export function loadComplaints() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return INITIAL_COMPLAINTS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_COMPLAINTS
    return parsed
  } catch {
    return INITIAL_COMPLAINTS
  }
}

export function saveComplaints(complaints) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(complaints))
  } catch {
    // storage full / blocked — app keeps working in-memory
  }
}

export function resetStoredComplaints() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
