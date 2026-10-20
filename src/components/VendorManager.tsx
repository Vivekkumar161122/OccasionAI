import React, { useState } from 'react'
import {
  ExternalLink,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react'
import { CATEGORY_METADATA, formatCurrency } from '../services/budgetCalculator'
import { sanitizeInput, sanitizeNumber, sanitizeUrl } from '../services/sanitizer'
import {
  BudgetCategory,
  OccasionEvent,
  VendorItem,
  VendorStatus,
} from '../types'

interface VendorManagerProps {
  event: OccasionEvent
  vendors: VendorItem[]
  onAddVendor: (vendor: Omit<VendorItem, 'id' | 'eventId'>) => void
  onUpdateVendor: (id: string, updates: Partial<VendorItem>) => void
  onDeleteVendor: (id: string) => void
}

const STATUS_METADATA: Record<VendorStatus, { label: string; color: string; bg: string }> = {
  researching: { label: 'Researching', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
  inquired: { label: 'Inquired', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  quoted: { label: 'Quoted Received', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
  booked: { label: 'Contract Signed', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  deposit_paid: { label: 'Deposit Paid', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
  completed: { label: 'Fully Paid & Complete', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
  declined: { label: 'Declined / Passed', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
}

export const VendorManager: React.FC<VendorManagerProps> = ({
  event,
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [category, setCategory] = useState<BudgetCategory>('venue')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<VendorStatus>('researching')
  const [quotedAmount, setQuotedAmount] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAddVendor({
      name: sanitizeInput(name, 100),
      category,
      contactPerson: sanitizeInput(contactPerson, 80),
      email: sanitizeInput(email, 100),
      phone: sanitizeInput(phone, 30),
      website: sanitizeUrl(website),
      status,
      quotedAmount: sanitizeNumber(quotedAmount, 0),
      notes: sanitizeInput(notes, 500),
      deliverables: [],
    })

    setName('')
    setContactPerson('')
    setEmail('')
    setPhone('')
    setWebsite('')
    setQuotedAmount('')
    setNotes('')
    setStatus('researching')
    setIsModalOpen(false)
  }

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.contactPerson && v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const bookedCount = vendors.filter((v) => ['booked', 'deposit_paid', 'completed'].includes(v.status)).length

  return (
    <div className="vendor-manager" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <section className="glass-card" style={{ padding: '24px' }} aria-labelledby="vendor-banner-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 id="vendor-banner-heading" style={{ fontSize: '1.35rem' }}>
                Vendor Checklist & Directory ({vendors.length})
              </h2>
              <span className="badge badge-custom" style={{ textTransform: 'none' }}>
                <UserCheck size={14} aria-hidden="true" />
                {bookedCount} of {vendors.length} Secured
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage inquiries, contracts, quotes, and points of contact across all event services
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.9rem' }}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Add Vendor</span>
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '0 12px',
          }}>
            <Search size={16} color="var(--text-muted)" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor name or contact..."
              aria-label="Search vendor name or contact"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 10px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                width: '200px',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="vendor-status-select" className="sr-only">Filter by status</label>
            <select
              id="vendor-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.88rem', cursor: 'pointer' }}
            >
              <option value="all" style={{ background: '#1e293b' }}>All Statuses</option>
              {Object.entries(STATUS_METADATA).map(([key, meta]) => (
                <option key={key} value={key} style={{ background: '#1e293b' }}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Vendor Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px',
      }}>
        {filteredVendors.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No vendors match your search. Use &ldquo;Add Vendor&rdquo; or the AI Assistant to automatically pull recommended vendors with pricing estimates!
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const statusInfo = STATUS_METADATA[vendor.status] || STATUS_METADATA.researching
            const catInfo = CATEGORY_METADATA[vendor.category] || CATEGORY_METADATA.miscellaneous

            return (
              <div
                key={vendor.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div>
                  {/* Category & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: catInfo.color }} />
                      {catInfo.label}
                    </span>

                    {/* Status Select dropdown */}
                    <select
                      value={vendor.status}
                      onChange={(e) => onUpdateVendor(vendor.id, { status: e.target.value as VendorStatus })}
                      style={{
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.color}40`,
                        borderRadius: 'var(--radius-full)',
                        padding: '3px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      aria-label={`Update status for ${vendor.name}`}
                    >
                      {Object.entries(STATUS_METADATA).map(([sKey, sMeta]) => (
                        <option key={sKey} value={sKey} style={{ background: '#1e293b', color: '#fff' }}>
                          {sMeta.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {vendor.name}
                  </h3>

                  {vendor.contactPerson && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} color="var(--primary-500)" aria-hidden="true" />
                      <span>{vendor.contactPerson}</span>
                    </p>
                  )}

                  {vendor.quotedAmount !== undefined && vendor.quotedAmount > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Quote: <strong>{formatCurrency(vendor.quotedAmount, event.currency)}</strong>
                    </div>
                  )}

                  {vendor.notes && (
                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginTop: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {vendor.notes}
                    </p>
                  )}
                </div>

                {/* Footer with Contact Links & Delete */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {vendor.phone && (
                      <a
                        href={`tel:${vendor.phone}`}
                        className="btn-ghost"
                        style={{ padding: '6px', color: 'var(--primary-500)' }}
                        title={`Call ${vendor.phone}`}
                      >
                        <Phone size={16} aria-hidden="true" />
                        <span className="sr-only">Call {vendor.name}</span>
                      </a>
                    )}
                    {vendor.email && (
                      <a
                        href={`mailto:${vendor.email}`}
                        className="btn-ghost"
                        style={{ padding: '6px', color: '#06b6d4' }}
                        title={`Email ${vendor.email}`}
                      >
                        <Mail size={16} aria-hidden="true" />
                        <span className="sr-only">Email {vendor.name}</span>
                      </a>
                    )}
                    {vendor.website && (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                        style={{ padding: '6px', color: '#10b981' }}
                        title="Open vendor website"
                      >
                        <ExternalLink size={16} aria-hidden="true" />
                        <span className="sr-only">Visit {vendor.name} website</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteVendor(vendor.id)}
                    className="btn-ghost"
                    style={{ color: 'var(--status-danger)', padding: '6px' }}
                    title="Delete vendor"
                    aria-label={`Delete ${vendor.name}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add Vendor Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-vendor-title">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 id="add-vendor-title" style={{ fontSize: '1.25rem' }}>Add Service Vendor</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-ghost"
                style={{ fontSize: '1.2rem', padding: '4px 8px' }}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="vendor-name">Vendor or Company Name *</label>
                  <input
                    id="vendor-name"
                    type="text"
                    required
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Blooms, Sunset DJ Collective"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="vendor-category">Service Category</label>
                  <select
                    id="vendor-category"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BudgetCategory)}
                  >
                    {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
                      <option key={key} value={key} style={{ background: '#1e293b' }}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="vendor-contact">Contact Person</label>
                    <input
                      id="vendor-contact"
                      type="text"
                      className="form-control"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Emily Clark"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="vendor-status">Initial Status</label>
                    <select
                      id="vendor-status"
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as VendorStatus)}
                    >
                      {Object.entries(STATUS_METADATA).map(([key, meta]) => (
                        <option key={key} value={key} style={{ background: '#1e293b' }}>
                          {meta.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="vendor-email">Email Address</label>
                    <input
                      id="vendor-email"
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@vendor.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="vendor-phone">Phone Number</label>
                    <input
                      id="vendor-phone"
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="vendor-quote">Quoted Cost ({event.currency})</label>
                    <input
                      id="vendor-quote"
                      type="number"
                      min="0"
                      step="any"
                      className="form-control"
                      value={quotedAmount}
                      onChange={(e) => setQuotedAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="vendor-website">Website URL</label>
                    <input
                      id="vendor-website"
                      type="url"
                      className="form-control"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="vendor-notes">Notes & Deliverables</label>
                  <textarea
                    id="vendor-notes"
                    className="form-control"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Deposit deadlines, equipment inclusions, contract terms..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
