import { defaultInquiries, defaultMessages } from './siteData.js'

const MESSAGE_KEY = 'tea-web-messages'
const INQUIRY_KEY = 'tea-web-inquiries'

function readList(key, fallback) {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)

    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function writeList(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getMessages() {
  return readList(MESSAGE_KEY, defaultMessages)
}

export function saveMessage(message) {
  const messages = [message, ...getMessages()]
  writeList(MESSAGE_KEY, messages)
  return messages
}

export function updateMessageStatus(id, updates) {
  const messages = getMessages().map((item) =>
    item.id === id ? { ...item, ...updates } : item,
  )

  writeList(MESSAGE_KEY, messages)
  return messages
}

export function getInquiries() {
  return readList(INQUIRY_KEY, defaultInquiries)
}

export function saveInquiry(inquiry) {
  const inquiries = [inquiry, ...getInquiries()]
  writeList(INQUIRY_KEY, inquiries)
  return inquiries
}
