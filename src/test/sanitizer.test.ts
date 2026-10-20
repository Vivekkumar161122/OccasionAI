import { describe, expect, it } from 'vitest'
import {
  escapeHTML,
  sanitizeDate,
  sanitizeInput,
  sanitizeNumber,
  sanitizeUrl,
} from '../services/sanitizer'

describe('Security & Sanitizer Service', () => {
  it('escapes HTML special characters properly', () => {
    const raw = '<script>alert("xss & fun")</script>'
    const escaped = escapeHTML(raw)
    expect(escaped).toBe('&lt;script&gt;alert(&quot;xss &amp; fun&quot;)&lt;/script&gt;')
  })

  it('strips malicious script tags, iframes, and on* handlers', () => {
    const inputWithScript = 'Hello <script>malicious()</script> World'
    expect(sanitizeInput(inputWithScript)).toBe('Hello  World')

    const inputWithHandler = '<button onclick="alert(1)">Click</button>'
    expect(sanitizeInput(inputWithHandler)).toBe('<button >Click</button>')

    const inputWithIframe = '<iframe src="evil.com"></iframe>Safe'
    expect(sanitizeInput(inputWithIframe)).toBe('Safe')
  })

  it('truncates inputs to specified maxLength to prevent buffer and memory abuse', () => {
    const longString = 'a'.repeat(600)
    expect(sanitizeInput(longString, 50).length).toBe(50)
  })

  it('sanitizes numbers safely and bounds within min/max', () => {
    expect(sanitizeNumber(45.678)).toBe(45.68)
    expect(sanitizeNumber('$1,250.50')).toBe(1250.5)
    expect(sanitizeNumber(-10, 0, 0, 100)).toBe(0)
    expect(sanitizeNumber(500, 0, 0, 100)).toBe(100)
    expect(sanitizeNumber('invalid-string', 42)).toBe(42)
  })

  it('validates and sanitizes date strings', () => {
    expect(sanitizeDate('2026-11-14')).toBe('2026-11-14')
    // Invalid date returns today's date
    const fallback = sanitizeDate('not-a-date')
    expect(/^\d{4}-\d{2}-\d{2}$/.test(fallback)).toBe(true)
  })

  it('only allows valid http and https URLs and rejects javascript: pseudo-protocols', () => {
    expect(sanitizeUrl('https://kewgardens.org')).toBe('https://kewgardens.org')
    expect(sanitizeUrl('http://mysite.com/wedding')).toBe('http://mysite.com/wedding')
    expect(sanitizeUrl('javascript:alert(1)')).toBe('')
    expect(sanitizeUrl('data:text/html,...')).toBe('')
  })
})
