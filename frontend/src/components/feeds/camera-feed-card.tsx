'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Zone } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Video, VideoOff, Settings, Plus } from 'lucide-react'

interface CameraFeedCardProps {
  camera: Camera
  zones: Zone[]
  onConfigureZone: (zone: Zone) => void
  onAddZone: (cameraId: string) => void
  onEditCamera: (camera: Camera) => void
}

export function CameraFeedCard({ camera, zones, onConfigureZone, onAddZone, onEditCamera }: CameraFeedCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Draw zones on canvas
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match image
    canvas.width = imageRef.current.width
    canvas.height = imageRef.current.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw each zone
    zones.forEach(zone => {
      if (!zone.enabled) return

      ctx.strokeStyle = zone.color
      ctx.lineWidth = 3
      ctx.fillStyle = zone.color + '20' // 20% opacity

      ctx.beginPath()
      zone.coordinates.forEach((point, index) => {
        const x = (point.x / 100) * canvas.width
        const y = (point.y / 100) * canvas.height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()
      ctx.stroke()
      ctx.fill()

      // Draw zone label
      if (zone.coordinates.length > 0) {
        const firstPoint = zone.coordinates[0]
        const x = (firstPoint.x / 100) * canvas.width
        const y = (firstPoint.y / 100) * canvas.height

        ctx.fillStyle = zone.color
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText(zone.name, x + 5, y - 5)
      }
    })
  }, [zones, imageLoaded])

  const statusColor = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    error: 'bg-red-500',
  }[camera.status]

  const statusIcon = camera.status === 'online' ? (
    <Video className="h-4 w-4" />
  ) : (
    <VideoOff className="h-4 w-4" />
  )

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Camera Header */}
      <div className="bg-gray-50 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusColor}`} />
            <div>
              <h3 className="font-semibold text-gray-800">{camera.name}</h3>
              <p className="text-sm text-gray-800">{camera.cameraId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {statusIcon}
              <span className="ml-1">{camera.status}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditCamera(camera)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Camera Feed */}
      <div className="relative aspect-video bg-gray-900">
        {/* Placeholder image - in production this would be a live stream or snapshot */}
        <img
          ref={imageRef}
          src={`https://via.placeholder.com/640x360/1f2937/ffffff?text=${encodeURIComponent(camera.name)}`}
          alt={camera.name}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Zone overlay canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* Camera info overlay */}
        <div className="absolute top-2 right-2 flex gap-2">
          {camera.resolution && (
            <Badge variant="secondary" className="text-xs">
              {camera.resolution}
            </Badge>
          )}
          {camera.fps && (
            <Badge variant="secondary" className="text-xs">
              {camera.fps} FPS
            </Badge>
          )}
        </div>
      </div>

      {/* Zones List */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-800">
            Zones ({zones.length})
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddZone(camera.cameraId)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Zone
          </Button>
        </div>

        {zones.length === 0 ? (
          <p className="text-sm text-gray-800 italic">No zones configured</p>
        ) : (
          <div className="space-y-1">
            {zones.map(zone => (
              <div
                key={zone.id}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-sm text-gray-800">{zone.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {zone.type.replace('_', ' ')}
                  </Badge>
                  {!zone.enabled && (
                    <Badge variant="secondary" className="text-xs">
                      Disabled
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onConfigureZone(zone)}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
