import React from 'react'
import {
  Calendar,
  Download,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Sun,
  Upload,
} from 'lucide-react'
import { CURRENCIES, CurrencyCode, OccasionEvent } from '../types'

interface NavbarProps {
  events: OccasionEvent[]
  activeEvent: OccasionEvent | null
  onSelectEvent: (eventId: string) => void
  onNewEvent: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onOpenSettings: () => void
  onExport: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeCurrency: (currency: CurrencyCode) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onNewEvent,
  theme,
  onToggleTheme,
  onOpenSettings,
  onExport,
  onImport,
  onChangeCurrency,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <header className="navbar-wrapper" role="banner" style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-secondary)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #fff 40%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                OccasionAI
              </span>
              <span className="badge badge-custom" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                GenAI Planner
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Weddings • Birthdays • Community Events
            </p>
          </div>
        </div>

        {/* Event Selector & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Event Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="event-selector" className="sr-only">Select Event</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '2px 8px',
            }}>
              <Calendar size={16} color="var(--primary-500)" style={{ marginRight: '6px' }} aria-hidden="true" />
              <select
                id="event-selector"
                value={activeEvent?.id || ''}
                onChange={(e) => onSelectEvent(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '6px 4px',
                  cursor: 'pointer',
                  maxWidth: '220px',
                }}
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id} style={{ background: '#1e293b', color: '#fff' }}>
                    {evt.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onNewEvent}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
              title="Create a new event"
              aria-label="Create new event"
            >
              <Plus size={16} aria-hidden="true" />
              <span>New Event</span>
            </button>
          </div>

          {/* Currency selector */}
          {activeEvent && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="currency-select" className="sr-only">Change Currency</label>
              <select
                id="currency-select"
                value={activeEvent.currency}
                onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
                className="btn-secondary"
                style={{
                  padding: '8px 10px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
                aria-label="Select currency"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code} style={{ background: '#1e293b', color: '#fff' }}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Export / Import */}
          <button
            onClick={onExport}
            className="btn-icon"
            title="Export event data (JSON backup)"
            aria-label="Export backup"
          >
            <Download size={18} aria-hidden="true" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-icon"
            title="Import event data (JSON)"
            aria-label="Import data"
          >
            <Upload size={18} aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={onImport}
            style={{ display: 'none' }}
            aria-label="Import JSON file input"
          />

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="btn-icon"
            title="AI and App Settings"
            aria-label="Settings"
          >
            <Settings size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
