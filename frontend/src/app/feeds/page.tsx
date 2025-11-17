'use client'

import { useState, useEffect } from 'react'
import { Camera, Zone } from '@/types'
import { getCameraFeeds, updateZone, createZone, deleteZone, createCamera, updateCamera, deleteCamera } from '@/lib/feeds-api'
import { CameraFeedCard } from '@/components/feeds/camera-feed-card'
import { ZoneConfigModal } from '@/components/feeds/zone-config-modal'
import { CameraConfigModal } from '@/components/feeds/camera-config-modal'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, Filter, Plus, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function FeedsPage() {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Zone configuration modal state
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [addingZoneForCamera, setAddingZoneForCamera] = useState<string | null>(null)
  const [zoneModalOpen, setZoneModalOpen] = useState(false)

  // Camera configuration modal state
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [cameraModalOpen, setCameraModalOpen] = useState(false)

  // Filters
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Load data
  const loadData = async () => {
    try {
      const feeds = await getCameraFeeds()
      const allCameras = feeds.map(f => f.camera)
      const allZones = feeds.flatMap(f => f.zones)

      setCameras(allCameras)
      setZones(allZones)
    } catch (error) {
      console.error('Failed to load camera feeds:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
  }

  // Camera handlers
  const handleAddCamera = () => {
    setSelectedCamera(null)
    setCameraModalOpen(true)
  }

  const handleEditCamera = (camera: Camera) => {
    setSelectedCamera(camera)
    setCameraModalOpen(true)
  }

  const handleSaveCamera = async (cameraData: Omit<Camera, 'id' | 'lastSeen'> | Camera) => {
    try {
      if ('id' in cameraData) {
        // Update existing camera
        await updateCamera(cameraData.id, cameraData)
      } else {
        // Create new camera
        await createCamera(cameraData)
      }

      // Reload data
      await loadData()
      setCameraModalOpen(false)
      setSelectedCamera(null)
    } catch (error) {
      console.error('Failed to save camera:', error)
      alert('Failed to save camera')
    }
  }

  const handleDeleteCamera = async (cameraId: string) => {
    try {
      await deleteCamera(cameraId)
      await loadData()
      setCameraModalOpen(false)
      setSelectedCamera(null)
    } catch (error) {
      console.error('Failed to delete camera:', error)
      alert('Failed to delete camera')
    }
  }

  // Zone handlers
  const handleConfigureZone = (zone: Zone) => {
    setSelectedZone(zone)
    setAddingZoneForCamera(null)
    setZoneModalOpen(true)
  }

  const handleAddZone = (cameraId: string) => {
    setSelectedZone(null)
    setAddingZoneForCamera(cameraId)
    setZoneModalOpen(true)
  }

  const handleSaveZone = async (zoneData: Omit<Zone, 'id'> | Zone) => {
    try {
      if ('id' in zoneData) {
        // Update existing zone
        await updateZone(zoneData.id, zoneData)
      } else {
        // Create new zone
        await createZone(zoneData)
      }

      // Reload data
      await loadData()
      setZoneModalOpen(false)
      setSelectedZone(null)
      setAddingZoneForCamera(null)
    } catch (error) {
      console.error('Failed to save zone:', error)
      alert('Failed to save zone')
    }
  }

  const handleDeleteZone = async (zoneId: string) => {
    try {
      await deleteZone(zoneId)
      await loadData()
      setZoneModalOpen(false)
      setSelectedZone(null)
    } catch (error) {
      console.error('Failed to delete zone:', error)
      alert('Failed to delete zone')
    }
  }

  // Get unique locations
  const locations = Array.from(new Set(cameras.map(c => c.location)))

  // Filter cameras
  const filteredCameras = cameras.filter(camera => {
    if (locationFilter !== 'all' && camera.location !== locationFilter) {
      return false
    }
    if (statusFilter !== 'all' && camera.status !== statusFilter) {
      return false
    }
    return true
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Camera Feeds</h1>
          <p className="text-gray-800 mt-1">
            Monitor live camera feeds and configure detection zones
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddCamera} variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Camera
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Filter className="h-5 w-5 text-gray-800" />

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Location:</label>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto text-sm text-gray-800">
          Showing {filteredCameras.length} of {cameras.length} cameras
        </div>
      </div>

      {/* Camera Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
            </div>
          ))}
        </div>
      ) : cameras.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Cameras Configured</h3>
          <p className="text-gray-800 mb-6">
            Get started by adding your first camera to the system
          </p>
          <Button onClick={handleAddCamera}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Camera
          </Button>
        </div>
      ) : filteredCameras.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-800">No cameras found matching the filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCameras.map(camera => {
            const cameraZones = zones.filter(z => z.cameraId === camera.cameraId)
            return (
              <CameraFeedCard
                key={camera.id}
                camera={camera}
                zones={cameraZones}
                onConfigureZone={handleConfigureZone}
                onAddZone={handleAddZone}
                onEditCamera={handleEditCamera}
              />
            )
          })}
        </div>
      )}

      {/* Modals */}
      {cameraModalOpen && (
        <CameraConfigModal
          camera={selectedCamera}
          onSave={handleSaveCamera}
          onDelete={selectedCamera ? handleDeleteCamera : undefined}
          onClose={() => {
            setCameraModalOpen(false)
            setSelectedCamera(null)
          }}
        />
      )}

      {zoneModalOpen && (
        <ZoneConfigModal
          zone={selectedZone}
          cameraId={addingZoneForCamera || undefined}
          onSave={handleSaveZone}
          onDelete={selectedZone ? handleDeleteZone : undefined}
          onClose={() => {
            setZoneModalOpen(false)
            setSelectedZone(null)
            setAddingZoneForCamera(null)
          }}
        />
      )}
      </div>
    </div>
  )
}
