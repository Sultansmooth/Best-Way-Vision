'use client'

import { useState } from 'react'
import { Camera } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Trash2, Check, HelpCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CameraConfigModalProps {
  camera: Camera | null
  onSave: (camera: Omit<Camera, 'id' | 'lastSeen'> | Camera) => void
  onDelete?: (cameraId: string) => void
  onClose: () => void
}

export function CameraConfigModal({ camera, onSave, onDelete, onClose }: CameraConfigModalProps) {
  const [name, setName] = useState(camera?.name || '')
  const [location, setLocation] = useState(camera?.location || '')
  const [cameraId, setCameraId] = useState(camera?.cameraId || '')
  const [rtspUrl, setRtspUrl] = useState(camera?.rtspUrl || '')
  const [resolution, setResolution] = useState(camera?.resolution || '1920x1080')
  const [fps, setFps] = useState(camera?.fps || 30)
  const [status, setStatus] = useState<'online' | 'offline' | 'error'>(camera?.status || 'offline')

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a camera name')
      return
    }

    if (!cameraId.trim()) {
      alert('Please enter a camera ID')
      return
    }

    const cameraData: Omit<Camera, 'id' | 'lastSeen'> = {
      name: name.trim(),
      location: location.trim(),
      cameraId: cameraId.trim(),
      rtspUrl: rtspUrl.trim() || undefined,
      resolution: resolution || undefined,
      fps: fps || undefined,
      status,
    }

    if (camera) {
      onSave({ ...camera, ...cameraData })
    } else {
      onSave(cameraData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {camera ? 'Edit Camera' : 'Add New Camera'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Basic Information</h3>

            <div>
              <Label htmlFor="camera-name" className="text-gray-800">
                Camera Name *
              </Label>
              <Input
                id="camera-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Dock 1 - Front View"
                className="mt-1"
              />
              <p className="text-sm text-gray-800 mt-1">
                A friendly name to identify this camera
              </p>
            </div>

            <div>
              <Label htmlFor="camera-id" className="text-gray-800">
                Camera ID *
              </Label>
              <Input
                id="camera-id"
                value={cameraId}
                onChange={e => setCameraId(e.target.value)}
                placeholder="e.g., CAM-DOCK-001"
                className="mt-1"
              />
              <p className="text-sm text-gray-800 mt-1">
                Unique identifier for this camera (used in event logs)
              </p>
            </div>

            <div>
              <Label htmlFor="location" className="text-gray-800">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., Dock 1, Warehouse Zone A"
                className="mt-1"
              />
            </div>
          </div>

          {/* Connection Info */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">Connection Settings</h3>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-gray-700 cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  RTSP URL format: rtsp://username:password@ip:port/stream
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="rtsp-url" className="text-gray-800">
                RTSP URL
              </Label>
              <Input
                id="rtsp-url"
                value={rtspUrl}
                onChange={e => setRtspUrl(e.target.value)}
                placeholder="rtsp://192.168.1.100:554/stream1"
                className="mt-1 font-mono text-sm"
              />
              <p className="text-sm text-gray-800 mt-1">
                RTSP stream URL from your NVR or camera
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resolution" className="text-gray-800">
                  Resolution
                </Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1920x1080">1920x1080 (1080p)</SelectItem>
                    <SelectItem value="2560x1440">2560x1440 (1440p)</SelectItem>
                    <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                    <SelectItem value="1280x720">1280x720 (720p)</SelectItem>
                    <SelectItem value="640x480">640x480 (480p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fps" className="text-gray-800">
                  FPS
                </Label>
                <Input
                  id="fps"
                  type="number"
                  value={fps}
                  onChange={e => setFps(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status" className="text-gray-800">
                Status
              </Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {camera && onDelete && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this camera? All zones will also be deleted.')) {
                    onDelete(camera.id)
                  }
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Camera
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Camera
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
