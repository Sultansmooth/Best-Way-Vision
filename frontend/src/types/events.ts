// Base event interface shared by all event types
export interface BaseEvent {
  id: string
  type: 'pallet' | 'trailer' | 'security'
  timestamp: Date
  location: string
  cameraId: string
  snapshotUrl?: string
}

// Pallet identification event
export interface PalletEvent extends BaseEvent {
  type: 'pallet'
  cartonCount: number
  zone: string // Specific zone/area in building
}

// Trailer tracking event
export interface TrailerEvent extends BaseEvent {
  type: 'trailer'
  trailerName?: string // OCR from trailer side
  trailerNumber?: string
  direction: 'arrival' | 'departure'
  dockNumber?: string
}

// Security alert event
export interface SecurityEvent extends BaseEvent {
  type: 'security'
  alertType: 'unauthorized_personnel' | 'suspicious_activity' | 'restricted_area' | 'after_hours'
  severity: 'low' | 'medium' | 'high'
  description?: string
}

// Union type for all events
export type Event = PalletEvent | TrailerEvent | SecurityEvent

// Event filters for searching/filtering
export interface EventFilters {
  type?: 'pallet' | 'trailer' | 'security' | 'all'
  startDate?: Date
  endDate?: Date
  location?: string
  searchQuery?: string
  severity?: 'low' | 'medium' | 'high'
}

// Statistics for dashboard
export interface EventStats {
  totalToday: number
  totalThisWeek: number
  palletCount: number
  trailerCount: number
  securityCount: number
  averageCartons?: number
}
