// Types for camera feeds and zone configuration

export interface Camera {
  id: string
  name: string
  location: string
  cameraId: string // Matches the cameraId in events
  rtspUrl?: string
  status: 'online' | 'offline' | 'error'
  resolution?: string
  fps?: number
  lastSeen?: Date
}

export interface Zone {
  id: string
  name: string
  cameraId: string
  type: 'pallet_scan' | 'trailer_dock' | 'security'
  coordinates: Point[]
  color: string
  enabled: boolean
  config?: ZoneConfig
}

export interface Point {
  x: number // Percentage (0-100)
  y: number // Percentage (0-100)
}

export interface ZoneConfig {
  // Pallet scan zone config
  minCartonCount?: number
  maxCartonCount?: number
  countingDirection?: 'in' | 'out'

  // Trailer dock config
  dockNumber?: string
  detectDirection?: boolean
  ocrEnabled?: boolean

  // Security zone config
  alertType?: 'unauthorized_personnel' | 'suspicious_activity' | 'restricted_area' | 'after_hours'
  severity?: 'low' | 'medium' | 'high'
  scheduleEnabled?: boolean
  activeHours?: { start: string; end: string }
}

export interface CameraFeed {
  camera: Camera
  zones: Zone[]
  isStreaming: boolean
  snapshotUrl?: string
}
