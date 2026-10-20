import {
  AppState,
  BudgetItem,
  OccasionEvent,
  TimelineItem,
  VendorItem,
} from '../types'
import { sanitizeDate, sanitizeInput, sanitizeNumber } from './sanitizer'

const STORAGE_KEY = 'occasionai_state_v1'

export const DEFAULT_WEDDING_EVENT: OccasionEvent = {
  id: 'evt-wedding-demo',
  title: 'Sophia & Liam’s Botanical Romance Wedding',
  type: 'wedding',
  date: '2026-11-14',
  location: 'Kew Royal Conservatories & Orangery',
  guestCount: 120,
  vibe: 'Timeless botanical elegance with candlelit dinner and acoustic strings',
  targetBudget: 35000,
  currency: 'USD',
  notes: 'Outdoor ceremony on lawn; indoor orangery reception if rain.',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
}

export const DEFAULT_WEDDING_BUDGET: BudgetItem[] = [
  { id: 'b-1', eventId: 'evt-wedding-demo', name: 'Conservatory Venue Hire & Bridal Suite', category: 'venue', estimatedCost: 11000, actualCost: 11500, isPaid: true },
  { id: 'b-2', eventId: 'evt-wedding-demo', name: 'Farm-to-Table Plated Dinner & Canapes (120 guests)', category: 'catering', estimatedCost: 9600, actualCost: 9600, isPaid: true },
  { id: 'b-3', eventId: 'evt-wedding-demo', name: 'Curated Open Bar & Champagne Toast', category: 'catering', estimatedCost: 3200, actualCost: 3000, isPaid: false },
  { id: 'b-4', eventId: 'evt-wedding-demo', name: 'Ceremony Arch, Hanging Greenery & Table Florals', category: 'decor', estimatedCost: 3500, actualCost: 3400, isPaid: true },
  { id: 'b-5', eventId: 'evt-wedding-demo', name: 'Fine Art Photographer (8 Hours + Drone)', category: 'photo_video', estimatedCost: 3200, actualCost: 3200, isPaid: true },
  { id: 'b-6', eventId: 'evt-wedding-demo', name: 'Live Acoustic String Duo + Evening DJ Fusion', category: 'entertainment', estimatedCost: 2200, actualCost: 2100, isPaid: false },
  { id: 'b-7', eventId: 'evt-wedding-demo', name: 'Bridal Gown, Alterations & Tuxedo Rental', category: 'attire_beauty', estimatedCost: 2000, actualCost: 1950, isPaid: true },
  { id: 'b-8', eventId: 'evt-wedding-demo', name: 'Foil-pressed Invitation Suites & Calligraphy', category: 'invitations_marketing', estimatedCost: 650, actualCost: 620, isPaid: true },
  { id: 'b-9', eventId: 'evt-wedding-demo', name: 'Handmade Botanical Olive Oil Guest Favors', category: 'favors_gifts', estimatedCost: 450, actualCost: 400, isPaid: false },
  { id: 'b-10', eventId: 'evt-wedding-demo', name: 'Event Liability Insurance & Day Contingency', category: 'permits_safety', estimatedCost: 500, actualCost: 450, isPaid: true },
]

export const DEFAULT_WEDDING_TIMELINE: TimelineItem[] = [
  { id: 't-1', eventId: 'evt-wedding-demo', title: 'Sign Orangery Venue Contract & Deposit', phase: 'pre_planning', dueDate: '2026-05-01', completed: true, priority: 'high' },
  { id: 't-2', eventId: 'evt-wedding-demo', title: 'Book Photographer & Reserve Engagement Shoot', phase: 'pre_planning', dueDate: '2026-06-15', completed: true, priority: 'high' },
  { id: 't-3', eventId: 'evt-wedding-demo', title: 'Catering Tasting & Custom Cocktail Finalization', phase: 'middle_planning', dueDate: '2026-08-20', completed: true, priority: 'high' },
  { id: 't-4', eventId: 'evt-wedding-demo', title: 'Mail Formal Invitations with RSVP Deadline', phase: 'middle_planning', dueDate: '2026-09-01', completed: true, priority: 'medium' },
  { id: 't-5', eventId: 'evt-wedding-demo', title: 'Final Dress & Tuxedo Fittings', phase: 'final_prep', dueDate: '2026-10-15', completed: true, priority: 'high' },
  { id: 't-6', eventId: 'evt-wedding-demo', title: 'Final Seating Chart & Placecards Handed to Planner', phase: 'week_of', dueDate: '2026-11-08', completed: false, priority: 'high' },
  { id: 't-7', eventId: 'evt-wedding-demo', title: 'Wedding Party Rehearsal Walkthrough & Dinner', phase: 'week_of', dueDate: '2026-11-13', completed: false, priority: 'high' },
  { id: 't-8', eventId: 'evt-wedding-demo', title: 'Hair & Makeup Styling Starts (Bridal Suite)', phase: 'day_of', time: '09:30', completed: false, priority: 'high' },
  { id: 't-9', eventId: 'evt-wedding-demo', title: 'Florist Delivers Bouquets & Sets Ceremony Arch', phase: 'day_of', time: '13:00', completed: false, priority: 'medium' },
  { id: 't-10', eventId: 'evt-wedding-demo', title: 'Guests Arrive & Acoustic Prelude Begins', phase: 'day_of', time: '15:30', completed: false, priority: 'high' },
  { id: 't-11', eventId: 'evt-wedding-demo', title: 'Ceremony Begins', phase: 'day_of', time: '16:00', completed: false, priority: 'high' },
  { id: 't-12', eventId: 'evt-wedding-demo', title: 'Cocktail Hour & Golden Hour Portraits', phase: 'day_of', time: '17:00', completed: false, priority: 'medium' },
  { id: 't-13', eventId: 'evt-wedding-demo', title: 'Grand Entrance & Plated Dinner Feasting', phase: 'day_of', time: '18:30', completed: false, priority: 'high' },
  { id: 't-14', eventId: 'evt-wedding-demo', title: 'Cake Cutting & First Dance Under Fairy Lights', phase: 'day_of', time: '20:15', completed: false, priority: 'high' },
  { id: 't-15', eventId: 'evt-wedding-demo', title: 'Sparkler Sendoff & Late Night Bites', phase: 'day_of', time: '22:45', completed: false, priority: 'medium' },
]

export const DEFAULT_WEDDING_VENDORS: VendorItem[] = [
  { id: 'v-1', eventId: 'evt-wedding-demo', name: 'Kew Conservatory & Gardens', category: 'venue', contactPerson: 'Eleanor Vance', email: 'events@kewconservatory.demo', phone: '+1 555-019-2834', status: 'deposit_paid', quotedAmount: 11500, notes: 'Includes tables, Chiavari chairs, clean-up staff' },
  { id: 'v-2', eventId: 'evt-wedding-demo', name: 'Wild Thyme Organic Catering', category: 'catering', contactPerson: 'Chef Marcus Holt', email: 'marcus@wildthymecatering.demo', phone: '+1 555-018-4721', status: 'deposit_paid', quotedAmount: 9600, notes: 'Includes 12 servers, tableware, and cocktail hour canapés' },
  { id: 'v-3', eventId: 'evt-wedding-demo', name: 'Lumiere Fine Art Photography', category: 'photo_video', contactPerson: 'Clara Chen', email: 'clara@lumierephoto.demo', phone: '+1 555-012-9981', status: 'deposit_paid', quotedAmount: 3200, notes: '2 shooters, 8 hour coverage, full digital delivery in 3 weeks' },
  { id: 'v-4', eventId: 'evt-wedding-demo', name: 'Botanica Bloom Floral Studio', category: 'decor', contactPerson: 'Julian Ramos', email: 'hello@botanicabloom.demo', phone: '+1 555-014-3329', status: 'booked', quotedAmount: 3400, notes: 'Using seasonal olive branches, garden roses, and brass tapers' },
  { id: 'v-5', eventId: 'evt-wedding-demo', name: 'Velvet Strings & DJ Echo', category: 'entertainment', contactPerson: 'David Ross', email: 'bookings@echosounds.demo', phone: '+1 555-017-7712', status: 'quoted', quotedAmount: 2100, notes: 'Duo for ceremony, full DJ & uplighting rig for reception' },
]

export const DEFAULT_BIRTHDAY_EVENT: OccasionEvent = {
  id: 'evt-birthday-demo',
  title: 'Marcus’s 30th Studio 54 Disco Bash',
  type: 'birthday',
  date: '2026-11-28',
  location: 'The Velvet Attic Loft & Rooftop',
  guestCount: 65,
  vibe: 'Retro 70s glam, hanging mirror balls, craft cocktail bar & heavy vinyl beats',
  targetBudget: 6000,
  currency: 'USD',
  notes: 'Dress code: Studio 54 metallic chic & sequins',
  createdAt: '2026-10-05T12:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
}

export const DEFAULT_BIRTHDAY_BUDGET: BudgetItem[] = [
  { id: 'bb-1', eventId: 'evt-birthday-demo', name: 'Velvet Attic Private Loft Rental (6 hours)', category: 'venue', estimatedCost: 1800, actualCost: 1800, isPaid: true },
  { id: 'bb-2', eventId: 'evt-birthday-demo', name: 'Artisan Sliders, Fondue Bar & Grazing Platters', category: 'catering', estimatedCost: 1600, actualCost: 1550, isPaid: true },
  { id: 'bb-3', eventId: 'evt-birthday-demo', name: 'Specialty Cocktail Ingredients & Bar Mixers', category: 'catering', estimatedCost: 600, actualCost: 550, isPaid: false },
  { id: 'bb-4', eventId: 'evt-birthday-demo', name: 'Cluster Mirror Balls & Custom Neon Birthday Sign', category: 'decor', estimatedCost: 500, actualCost: 480, isPaid: true },
  { id: 'bb-5', eventId: 'evt-birthday-demo', name: 'Retro Vinyl DJ (4-hour club set)', category: 'entertainment', estimatedCost: 800, actualCost: 750, isPaid: false },
  { id: 'bb-6', eventId: 'evt-birthday-demo', name: 'Lambeth Vintage Tiered Cake & Sparklers', category: 'catering', estimatedCost: 250, actualCost: 250, isPaid: true },
  { id: 'bb-7', eventId: 'evt-birthday-demo', name: 'Instant Polaroid Cameras & Film Packs', category: 'photo_video', estimatedCost: 200, actualCost: 180, isPaid: true },
]

export const DEFAULT_COMMUNITY_EVENT: OccasionEvent = {
  id: 'evt-community-demo',
  title: 'Oakridge Neighborhood Spring Cultural & Arts Fest',
  type: 'community',
  date: '2026-12-05',
  location: 'Oakridge Community Park & Pedestrian Esplanade',
  guestCount: 350,
  vibe: 'Inclusive family festival with live local music, artisan maker stalls, and food trucks',
  targetBudget: 12000,
  currency: 'USD',
  notes: 'Rain location: Adjacent High School Gymnasium. Free admission.',
  createdAt: '2026-10-10T09:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
}

export const DEFAULT_COMMUNITY_BUDGET: BudgetItem[] = [
  { id: 'cb-1', eventId: 'evt-community-demo', name: 'Municipal Park & Sound Ordinance Permit', category: 'permits_safety', estimatedCost: 850, actualCost: 850, isPaid: true },
  { id: 'cb-2', eventId: 'evt-community-demo', name: 'Covered Stage, Generator & Sound Engineer Rig', category: 'entertainment', estimatedCost: 3500, actualCost: 3400, isPaid: true },
  { id: 'cb-3', eventId: 'evt-community-demo', name: 'Temporary ADA Restrooms & Sanitation Stations', category: 'permits_safety', estimatedCost: 2200, actualCost: 2150, isPaid: true },
  { id: 'cb-4', eventId: 'evt-community-demo', name: 'On-site Licensed Paramedic & Security Detail', category: 'permits_safety', estimatedCost: 1500, actualCost: 1500, isPaid: false },
  { id: 'cb-5', eventId: 'evt-community-demo', name: 'Community Hands-On Art Mural Supplies', category: 'decor', estimatedCost: 900, actualCost: 820, isPaid: true },
  { id: 'cb-6', eventId: 'evt-community-demo', name: 'Wayfinding Banners, Printed Maps & Lawn Signs', category: 'invitations_marketing', estimatedCost: 650, actualCost: 600, isPaid: true },
  { id: 'cb-7', eventId: 'evt-community-demo', name: 'Performers Honorarium & Youth Band Stipends', category: 'entertainment', estimatedCost: 1800, actualCost: 1800, isPaid: false },
]

export function getInitialAppState(): AppState {
  const events = [DEFAULT_WEDDING_EVENT, DEFAULT_BIRTHDAY_EVENT, DEFAULT_COMMUNITY_EVENT]
  const budgetItems = [...DEFAULT_WEDDING_BUDGET, ...DEFAULT_BIRTHDAY_BUDGET, ...DEFAULT_COMMUNITY_BUDGET]
  const timelineItems = [...DEFAULT_WEDDING_TIMELINE]
  const vendors = [...DEFAULT_WEDDING_VENDORS]

  return {
    events,
    activeEventId: DEFAULT_WEDDING_EVENT.id,
    budgetItems,
    timelineItems,
    vendors,
    aiSettings: {
      apiKey: '',
      useCustomKey: false,
      model: 'gemini-2.5-flash',
    },
  }
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getInitialAppState()
    const parsed = JSON.parse(raw) as Partial<AppState>

    // Validate structure
    if (!Array.isArray(parsed.events) || parsed.events.length === 0) {
      return getInitialAppState()
    }

    const validatedEvents: OccasionEvent[] = parsed.events.map((e) => ({
      id: sanitizeInput(e.id, 64) || `evt-${Date.now()}`,
      title: sanitizeInput(e.title, 120) || 'Untitled Event',
      type: (['wedding', 'birthday', 'community', 'custom'].includes(e.type) ? e.type : 'custom') as any,
      date: sanitizeDate(e.date),
      location: sanitizeInput(e.location, 160) || 'TBD',
      guestCount: sanitizeNumber(e.guestCount, 50, 1, 100000),
      vibe: sanitizeInput(e.vibe, 300) || '',
      targetBudget: sanitizeNumber(e.targetBudget, 5000, 0, 100000000),
      currency: (['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'].includes(e.currency) ? e.currency : 'USD') as any,
      notes: sanitizeInput(e.notes || '', 1000),
      createdAt: e.createdAt || new Date().toISOString(),
      updatedAt: e.updatedAt || new Date().toISOString(),
    }))

    const validatedBudget: BudgetItem[] = Array.isArray(parsed.budgetItems)
      ? parsed.budgetItems.map((b) => ({
          id: sanitizeInput(b.id, 64) || `b-${Date.now()}-${Math.random()}`,
          eventId: sanitizeInput(b.eventId, 64),
          name: sanitizeInput(b.name, 120) || 'Expense',
          category: b.category || 'miscellaneous',
          estimatedCost: sanitizeNumber(b.estimatedCost, 0),
          actualCost: sanitizeNumber(b.actualCost, 0),
          isPaid: Boolean(b.isPaid),
          vendorId: b.vendorId ? sanitizeInput(b.vendorId, 64) : undefined,
          notes: sanitizeInput(b.notes || '', 300),
        }))
      : []

    const validatedTimeline: TimelineItem[] = Array.isArray(parsed.timelineItems)
      ? parsed.timelineItems.map((t) => ({
          id: sanitizeInput(t.id, 64) || `t-${Date.now()}-${Math.random()}`,
          eventId: sanitizeInput(t.eventId, 64),
          title: sanitizeInput(t.title, 150) || 'Task',
          description: sanitizeInput(t.description || '', 400),
          phase: t.phase || 'pre_planning',
          dueDate: t.dueDate ? sanitizeDate(t.dueDate) : undefined,
          time: t.time ? sanitizeInput(t.time, 10) : undefined,
          completed: Boolean(t.completed),
          priority: t.priority || 'medium',
          assignedTo: sanitizeInput(t.assignedTo || '', 80),
        }))
      : []

    const validatedVendors: VendorItem[] = Array.isArray(parsed.vendors)
      ? parsed.vendors.map((v) => ({
          id: sanitizeInput(v.id, 64) || `v-${Date.now()}-${Math.random()}`,
          eventId: sanitizeInput(v.eventId, 64),
          name: sanitizeInput(v.name, 120) || 'Vendor',
          category: v.category || 'venue',
          contactPerson: sanitizeInput(v.contactPerson || '', 80),
          email: sanitizeInput(v.email || '', 120),
          phone: sanitizeInput(v.phone || '', 50),
          website: sanitizeInput(v.website || '', 200),
          status: v.status || 'researching',
          quotedAmount: sanitizeNumber(v.quotedAmount || 0, 0),
          notes: sanitizeInput(v.notes || '', 500),
          deliverables: Array.isArray(v.deliverables) ? v.deliverables.map((d) => sanitizeInput(d, 120)) : [],
        }))
      : []

    const activeEventId =
      parsed.activeEventId && validatedEvents.some((e) => e.id === parsed.activeEventId)
        ? parsed.activeEventId
        : validatedEvents[0].id

    return {
      events: validatedEvents,
      activeEventId,
      budgetItems: validatedBudget,
      timelineItems: validatedTimeline,
      vendors: validatedVendors,
      aiSettings: {
        apiKey: sanitizeInput(parsed.aiSettings?.apiKey || '', 128),
        useCustomKey: Boolean(parsed.aiSettings?.useCustomKey),
        model: parsed.aiSettings?.model === 'gemini-2.5-pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
      },
    }
  } catch (e) {
    console.error('Failed to parse local storage state, loading defaults', e)
    return getInitialAppState()
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state to localStorage', e)
  }
}

export function exportAppStateAsJSON(state: AppState): string {
  // Redact API key from export file for absolute security
  const safeState = {
    ...state,
    aiSettings: {
      ...state.aiSettings,
      apiKey: '',
    },
  }
  return JSON.stringify(safeState, null, 2)
}
