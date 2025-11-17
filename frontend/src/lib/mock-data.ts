import { Event, PalletEvent, TrailerEvent, SecurityEvent, EventStats } from '@/types'

// Locations in the building
const BUILDING_ZONES = [
  'Receiving Bay A',
  'Receiving Bay B',
  'Warehouse Zone 1',
  'Warehouse Zone 2',
  'Warehouse Zone 3',
  'Shipping Zone',
  'Loading Dock 1',
  'Loading Dock 2',
  'Loading Dock 3',
  'Storage Area North',
  'Storage Area South',
]

const DOCK_NUMBERS = ['Dock 1', 'Dock 2', 'Dock 3', 'Dock 4']

const TRAILER_NAMES = [
  'SWIFT-4521',
  'FEDEX-8832',
  'UPS-7721',
  'XPO-3341',
  'WERNER-6654',
  'SCHNEIDER-9923',
  'JB HUNT-4432',
  'OLD DOMINION-7788',
  'ESTES-2211',
  'KNIGHT-5566',
]

const ALERT_TYPES = [
  { type: 'unauthorized_personnel' as const, severity: 'high' as const, desc: 'Unauthorized person detected in restricted area' },
  { type: 'suspicious_activity' as const, severity: 'medium' as const, desc: 'Unusual movement pattern detected' },
  { type: 'restricted_area' as const, severity: 'high' as const, desc: 'Access to restricted area without clearance' },
  { type: 'after_hours' as const, severity: 'low' as const, desc: 'Activity detected outside business hours' },
]

// Generate random date within range
function randomDate(daysAgo: number): Date {
  const now = new Date()
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime())
  return new Date(randomTime)
}

// Generate random pallet event
function generatePalletEvent(id: number, date: Date): PalletEvent {
  return {
    id: `pallet-${id}`,
    type: 'pallet',
    timestamp: date,
    location: BUILDING_ZONES[Math.floor(Math.random() * BUILDING_ZONES.length)],
    zone: `Zone ${Math.floor(Math.random() * 5) + 1}`,
    cameraId: `CAM-${Math.floor(Math.random() * 20) + 1}`,
    cartonCount: Math.floor(Math.random() * 40) + 10, // 10-50 cartons
    snapshotUrl: `https://picsum.photos/seed/pallet-${id}/800/600`,
  }
}

// Generate random trailer event
function generateTrailerEvent(id: number, date: Date): TrailerEvent {
  return {
    id: `trailer-${id}`,
    type: 'trailer',
    timestamp: date,
    location: DOCK_NUMBERS[Math.floor(Math.random() * DOCK_NUMBERS.length)],
    dockNumber: `${Math.floor(Math.random() * 4) + 1}`,
    cameraId: `CAM-${Math.floor(Math.random() * 20) + 1}`,
    direction: Math.random() > 0.5 ? 'arrival' : 'departure',
    trailerName: TRAILER_NAMES[Math.floor(Math.random() * TRAILER_NAMES.length)],
    trailerNumber: `T-${Math.floor(Math.random() * 9000) + 1000}`,
    snapshotUrl: `https://picsum.photos/seed/trailer-${id}/800/600`,
  }
}

// Generate random security event
function generateSecurityEvent(id: number, date: Date): SecurityEvent {
  const alert = ALERT_TYPES[Math.floor(Math.random() * ALERT_TYPES.length)]
  return {
    id: `security-${id}`,
    type: 'security',
    timestamp: date,
    location: BUILDING_ZONES[Math.floor(Math.random() * BUILDING_ZONES.length)],
    cameraId: `CAM-${Math.floor(Math.random() * 20) + 1}`,
    alertType: alert.type,
    severity: alert.severity,
    description: alert.desc,
    snapshotUrl: `https://picsum.photos/seed/security-${id}/800/600`,
  }
}

// Generate mixed events for last N days
export function generateMockEvents(days: number = 7): Event[] {
  const events: Event[] = []
  let id = 1

  // Generate events for each day
  for (let day = 0; day < days; day++) {
    // More events on recent days
    const eventsPerDay = Math.floor(Math.random() * 20) + 10

    for (let i = 0; i < eventsPerDay; i++) {
      const date = randomDate(day)
      const eventType = Math.random()

      if (eventType < 0.5) {
        // 50% pallet events
        events.push(generatePalletEvent(id++, date))
      } else if (eventType < 0.85) {
        // 35% trailer events
        events.push(generateTrailerEvent(id++, date))
      } else {
        // 15% security events
        events.push(generateSecurityEvent(id++, date))
      }
    }
  }

  // Sort by timestamp (newest first)
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Calculate statistics from events
export function calculateStats(events: Event[]): EventStats {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const todayEvents = events.filter(e => e.timestamp >= today)
  const weekEvents = events.filter(e => e.timestamp >= weekAgo)

  const palletEvents = events.filter(e => e.type === 'pallet') as PalletEvent[]
  const trailerEvents = events.filter(e => e.type === 'trailer')
  const securityEvents = events.filter(e => e.type === 'security')

  const totalCartons = palletEvents.reduce((sum, e) => sum + e.cartonCount, 0)
  const averageCartons = palletEvents.length > 0 ? totalCartons / palletEvents.length : 0

  return {
    totalToday: todayEvents.length,
    totalThisWeek: weekEvents.length,
    palletCount: palletEvents.length,
    trailerCount: trailerEvents.length,
    securityCount: securityEvents.length,
    averageCartons: Math.round(averageCartons),
  }
}

// Simulate API delay
export function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
