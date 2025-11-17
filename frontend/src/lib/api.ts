import { Event, EventFilters, EventStats, EmailConfig } from '@/types'
import { generateMockEvents, calculateStats, delay } from './mock-data'

// In-memory storage for mock data
let mockEvents: Event[] = []
let mockEmailConfig: EmailConfig = {
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpUsername: 'notifications@bestway.com',
  smtpPassword: '********',
  recipients: ['manager@bestway.com', 'dave@bestway.com'],
  reportSchedule: 'daily',
  reportTime: '08:00',
}

// Initialize mock data
if (typeof window !== 'undefined') {
  // Check if we have data in localStorage
  const stored = localStorage.getItem('bw-vision-events')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      mockEvents = parsed.map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }))
    } catch (e) {
      console.error('Failed to load events from storage', e)
      mockEvents = [] // Start with empty data
    }
  } else {
    mockEvents = [] // Start with empty data - real events will come from backend
  }

  // Load email config from localStorage
  const storedConfig = localStorage.getItem('bw-vision-email-config')
  if (storedConfig) {
    try {
      mockEmailConfig = JSON.parse(storedConfig)
    } catch (e) {
      console.error('Failed to load email config', e)
    }
  }
}

// Save events to localStorage
function saveEvents() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bw-vision-events', JSON.stringify(mockEvents))
  }
}

// Filter events based on criteria
function filterEvents(events: Event[], filters?: EventFilters): Event[] {
  if (!filters) return events

  let filtered = events

  // Filter by type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(e => e.type === filters.type)
  }

  // Filter by date range
  if (filters.startDate) {
    filtered = filtered.filter(e => e.timestamp >= filters.startDate!)
  }
  if (filters.endDate) {
    const endOfDay = new Date(filters.endDate)
    endOfDay.setHours(23, 59, 59, 999)
    filtered = filtered.filter(e => e.timestamp <= endOfDay)
  }

  // Filter by location
  if (filters.location) {
    filtered = filtered.filter(e =>
      e.location.toLowerCase().includes(filters.location!.toLowerCase())
    )
  }

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(e => {
      // Search in common fields
      if (e.location.toLowerCase().includes(query)) return true
      if (e.cameraId.toLowerCase().includes(query)) return true

      // Type-specific searches
      if (e.type === 'trailer') {
        if (e.trailerName?.toLowerCase().includes(query)) return true
        if (e.trailerNumber?.toLowerCase().includes(query)) return true
      }
      if (e.type === 'security') {
        if (e.alertType.toLowerCase().includes(query)) return true
        if (e.description?.toLowerCase().includes(query)) return true
      }

      return false
    })
  }

  // Filter by severity (security events only)
  if (filters.severity) {
    filtered = filtered.filter(e =>
      e.type === 'security' && e.severity === filters.severity
    )
  }

  return filtered
}

// API Functions
export async function getEvents(filters?: EventFilters): Promise<Event[]> {
  await delay(200) // Simulate API call
  return filterEvents(mockEvents, filters)
}

export async function getEvent(id: string): Promise<Event | null> {
  await delay(150)
  return mockEvents.find(e => e.id === id) || null
}

export async function getEventStats(): Promise<EventStats> {
  await delay(100)
  return calculateStats(mockEvents)
}

export async function getEmailConfig(): Promise<EmailConfig> {
  await delay(100)
  return { ...mockEmailConfig }
}

export async function saveEmailConfig(config: EmailConfig): Promise<void> {
  await delay(200)
  mockEmailConfig = { ...config }
  if (typeof window !== 'undefined') {
    localStorage.setItem('bw-vision-email-config', JSON.stringify(config))
  }
}

export async function sendTestEmail(): Promise<void> {
  await delay(1000) // Simulate longer email send
  console.log('Test email sent to:', mockEmailConfig.recipients)
}

export async function refreshEvents(): Promise<void> {
  await delay(500)
  // In production, this would fetch fresh data from backend
  // For now, we'll just regenerate mock data
  mockEvents = generateMockEvents(30)
  saveEvents()
}

// Get trend data for charts
export interface TrendData {
  pallets: { date: string; value: number }[]
  trailers: { date: string; value: number }[]
  security: { date: string; value: number }[]
  total: { date: string; value: number }[]
}

export async function getTrendData(days: number = 7): Promise<TrendData> {
  await delay(100)

  const now = new Date()
  const trends: TrendData = {
    pallets: [],
    trailers: [],
    security: [],
    total: [],
  }

  // Generate data for last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    // Filter events for this day
    const dayEvents = mockEvents.filter(
      e => e.timestamp >= date && e.timestamp < nextDate
    )

    const palletCount = dayEvents.filter(e => e.type === 'pallet').length
    const trailerCount = dayEvents.filter(e => e.type === 'trailer').length
    const securityCount = dayEvents.filter(e => e.type === 'security').length

    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`

    trends.pallets.push({ date: dateStr, value: palletCount })
    trends.trailers.push({ date: dateStr, value: trailerCount })
    trends.security.push({ date: dateStr, value: securityCount })
    trends.total.push({ date: dateStr, value: dayEvents.length })
  }

  return trends
}
