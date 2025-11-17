import { Camera, Zone, CameraFeed } from '@/types'
import { delay } from './mock-data'

// In-memory storage for cameras and zones
// Start with empty arrays - users will add their own cameras and zones
let mockCameras: Camera[] = []
let mockZones: Zone[] = []

// Save to localStorage
function saveCameras() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bw-vision-cameras', JSON.stringify(mockCameras))
  }
}

function saveZones() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bw-vision-zones', JSON.stringify(mockZones))
  }
}

// Load from localStorage on init
if (typeof window !== 'undefined') {
  const storedCameras = localStorage.getItem('bw-vision-cameras')
  if (storedCameras) {
    try {
      const parsed = JSON.parse(storedCameras)
      mockCameras = parsed.map((c: any) => ({
        ...c,
        lastSeen: c.lastSeen ? new Date(c.lastSeen) : undefined,
      }))
    } catch (e) {
      console.error('Failed to load cameras', e)
    }
  }

  const storedZones = localStorage.getItem('bw-vision-zones')
  if (storedZones) {
    try {
      mockZones = JSON.parse(storedZones)
    } catch (e) {
      console.error('Failed to load zones', e)
    }
  }
}

// API Functions
export async function getCameras(): Promise<Camera[]> {
  await delay(100)
  return mockCameras
}

export async function getCamera(id: string): Promise<Camera | null> {
  await delay(100)
  return mockCameras.find(c => c.id === id) || null
}

export async function createCamera(camera: Omit<Camera, 'id' | 'lastSeen'>): Promise<Camera> {
  await delay(200)
  const newCamera: Camera = {
    ...camera,
    id: `cam-${Date.now()}`,
    lastSeen: new Date(),
  }
  mockCameras.push(newCamera)
  saveCameras()
  return newCamera
}

export async function updateCamera(id: string, updates: Partial<Camera>): Promise<Camera> {
  await delay(200)
  const index = mockCameras.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Camera not found')

  mockCameras[index] = { ...mockCameras[index], ...updates }
  saveCameras()
  return mockCameras[index]
}

export async function deleteCamera(id: string): Promise<void> {
  await delay(200)
  // Also delete all zones for this camera
  const camera = mockCameras.find(c => c.id === id)
  if (camera) {
    mockZones = mockZones.filter(z => z.cameraId !== camera.cameraId)
    saveZones()
  }
  mockCameras = mockCameras.filter(c => c.id !== id)
  saveCameras()
}

export async function getZones(cameraId?: string): Promise<Zone[]> {
  await delay(100)
  if (cameraId) {
    return mockZones.filter(z => z.cameraId === cameraId)
  }
  return mockZones
}

export async function getZone(id: string): Promise<Zone | null> {
  await delay(100)
  return mockZones.find(z => z.id === id) || null
}

export async function createZone(zone: Omit<Zone, 'id'>): Promise<Zone> {
  await delay(200)
  const newZone: Zone = {
    ...zone,
    id: `zone-${Date.now()}`,
  }
  mockZones.push(newZone)
  saveZones()
  return newZone
}

export async function updateZone(id: string, updates: Partial<Zone>): Promise<Zone> {
  await delay(200)
  const index = mockZones.findIndex(z => z.id === id)
  if (index === -1) throw new Error('Zone not found')

  mockZones[index] = { ...mockZones[index], ...updates }
  saveZones()
  return mockZones[index]
}

export async function deleteZone(id: string): Promise<void> {
  await delay(200)
  mockZones = mockZones.filter(z => z.id !== id)
  saveZones()
}

export async function getCameraFeeds(): Promise<CameraFeed[]> {
  await delay(150)
  return mockCameras.map(camera => ({
    camera,
    zones: mockZones.filter(z => z.cameraId === camera.cameraId),
    isStreaming: camera.status === 'online',
    snapshotUrl: `/api/camera/${camera.id}/snapshot`, // Placeholder
  }))
}
