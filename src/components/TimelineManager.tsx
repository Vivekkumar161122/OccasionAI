import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { sanitizeDate, sanitizeInput } from '../services/sanitizer'
import { OccasionEvent, PriorityLevel, TimelineItem, TimelinePhase } from '../types'

interface TimelineManagerProps {
  event: OccasionEvent
  items: TimelineItem[]
  onAddItem: (item: Omit<TimelineItem, 'id' | 'eventId'>) => void
  onToggleComplete: (id: string, completed: boolean) => void
  onDeleteItem: (id: string) => void
}

const PHASE_LABELS: Record<TimelinePhase, { label: string; badge: string }> = {
  pre_planning: { label: '6+ Months Out (Pre-Planning)', badge: 'Phase 1' },
  middle_planning: { label: '2-3 Months Out (Booking & Details)', badge: 'Phase 2' },
  final_prep: { label: '2-4 Weeks Out (Final Prep)', badge: 'Phase 3' },
  week_of: { label: 'Week of Event', badge: 'Countdown' },
  day_of: { label: 'Day-of Run of Show (Hourly Schedule)', badge: 'Live Execution' },
}

export const TimelineManager: React.FC<TimelineManagerProps> = ({
  items,
  onAddItem,
  onToggleComplete,
  onDeleteItem,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<TimelinePhase | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [phase, setPhase] = useState<TimelinePhase>('pre_planning')
  const [dueDate, setDueDate] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState<PriorityLevel>('medium')
  const [assignedTo, setAssignedTo] = useState('')

  const handleToggle = (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    onToggleComplete(id, nextStatus)

    // Trigger celebration if checking the final remaining task
    const remainingTasks = items.filter((t) => !t.completed && t.id !== id)
    if (nextStatus && remainingTasks.length === 0 && items.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddItem({
      title: sanitizeInput(title, 120),
      description: sanitizeInput(description, 300),
      phase,
      dueDate: dueDate ? sanitizeDate(dueDate) : undefined,
      time: time ? sanitizeInput(time, 10) : undefined,
      priority,
      assignedTo: sanitizeInput(assignedTo, 60),
      completed: false,
    })

    setTitle('')
    setDescription('')
    setDueDate('')
    setTime('')
    setAssignedTo('')
    setIsModalOpen(false)
  }

  const filteredItems = items
    .filter((item) => selectedPhase === 'all' || item.phase === selectedPhase)
    .sort((a, b) => {
      // Sort day-of items by hour string
      if (a.phase === 'day_of' && b.phase === 'day_of' && a.time && b.time) {
        return a.time.localeCompare(b.time)
      }
      // Sort by due date
      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate)
      }
      return 0
    })

  const total = items.length
  const completed = items.filter((t) => t.completed).length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="timeline-manager" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Progress Card */}
      <section className="glass-card" style={{ padding: '24px' }} aria-labelledby="timeline-progress-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 id="timeline-progress-heading" style={{ fontSize: '1.35rem' }}>
                Timeline & Run-of-Show Planner
              </h2>
              {pct === 100 && (
                <span className="badge badge-community" style={{ textTransform: 'none' }}>
                  <Sparkles size={14} aria-hidden="true" />
                  All Tasks Completed!
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Phase-by-phase countdown from early contracts to hourly day-of execution
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.9rem' }}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Add Milestone / Slot</span>
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Overall Readiness: {completed} of {total} milestones done</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-500)' }}>{pct}% Complete</span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${pct}%`,
                background: 'var(--primary-gradient)',
              }}
            />
          </div>
        </div>
      </section>

      {/* Phase Filters */}
      <div className="tabs-nav" role="tablist" aria-label="Timeline Phases">
        <button
          role="tab"
          aria-selected={selectedPhase === 'all'}
          onClick={() => setSelectedPhase('all')}
          className={`tab-btn ${selectedPhase === 'all' ? 'active' : ''}`}
        >
          All Milestones ({items.length})
        </button>
        {(Object.keys(PHASE_LABELS) as TimelinePhase[]).map((pKey) => {
          const count = items.filter((i) => i.phase === pKey).length
          return (
            <button
              key={pKey}
              role="tab"
              aria-selected={selectedPhase === pKey}
              onClick={() => setSelectedPhase(pKey)}
              className={`tab-btn ${selectedPhase === pKey ? 'active' : ''}`}
            >
              {PHASE_LABELS[pKey].label.split('(')[0].trim()} ({count})
            </button>
          )
        })}
      </div>

      {/* Timeline Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No milestones found for this phase. Click &ldquo;Add Milestone&rdquo; or explore the AI Assistant tab to generate a complete run-of-show automatically!
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                opacity: item.completed ? 0.65 : 1,
                borderLeft: `4px solid ${
                  item.priority === 'high' ? 'var(--status-danger)' : item.priority === 'medium' ? 'var(--status-warning)' : 'var(--primary-500)'
                }`,
              }}
            >
              {/* Checkbox & Details */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                <button
                  onClick={() => handleToggle(item.id, item.completed)}
                  style={{
                    marginTop: '2px',
                    color: item.completed ? 'var(--status-safe)' : 'var(--text-muted)',
                    transition: 'transform 0.15s',
                  }}
                  title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                  aria-label={`Toggle completion of ${item.title}`}
                >
                  {item.completed ? (
                    <CheckCircle2 size={22} color="var(--status-safe)" />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    }}>
                      {item.title}
                    </h3>

                    {/* Priority Badge */}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: item.priority === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                      color: item.priority === 'high' ? '#f87171' : 'var(--text-secondary)',
                    }}>
                      {item.priority}
                    </span>

                    {/* Phase indicator if in 'all' view */}
                    {selectedPhase === 'all' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        • {PHASE_LABELS[item.phase]?.badge || item.phase}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {item.description}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    {item.time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-500)', fontWeight: 600 }}>
                        <Clock size={13} aria-hidden="true" />
                        <span>{item.time}</span>
                      </div>
                    )}
                    {item.dueDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} aria-hidden="true" />
                        <span>Due: {item.dueDate}</span>
                      </div>
                    )}
                    {item.assignedTo && (
                      <div>
                        <span>Assigned: <strong>{item.assignedTo}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onDeleteItem(item.id)}
                className="btn-ghost"
                style={{ color: 'var(--status-danger)', padding: '6px' }}
                title="Delete milestone"
                aria-label={`Delete ${item.title}`}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Milestone Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 id="add-task-title" style={{ fontSize: '1.25rem' }}>Add Milestone or Day-of Slot</h3>
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
                  <label className="form-label" htmlFor="task-title">Milestone Title *</label>
                  <input
                    id="task-title"
                    type="text"
                    required
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Tasting session, First dance song cue, Setup barricades"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="task-phase">Planning Phase</label>
                  <select
                    id="task-phase"
                    className="form-control"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as TimelinePhase)}
                  >
                    {Object.entries(PHASE_LABELS).map(([key, data]) => (
                      <option key={key} value={key} style={{ background: '#1e293b' }}>
                        {data.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="task-date">Due Date</label>
                    <input
                      id="task-date"
                      type="date"
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="task-time">Day-of Time (e.g. 15:30)</label>
                    <input
                      id="task-time"
                      type="text"
                      className="form-control"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="14:00"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="task-priority">Priority</label>
                    <select
                      id="task-priority"
                      className="form-control"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    >
                      <option value="high" style={{ background: '#1e293b' }}>High Priority</option>
                      <option value="medium" style={{ background: '#1e293b' }}>Medium Priority</option>
                      <option value="low" style={{ background: '#1e293b' }}>Low Priority</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="task-assigned">Assigned Person</label>
                    <input
                      id="task-assigned"
                      type="text"
                      className="form-control"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="e.g. Maid of Honor, DJ, Host"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="task-desc">Description & Instructions</label>
                  <textarea
                    id="task-desc"
                    className="form-control"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Specific cues, contact numbers, or checklist notes..."
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
