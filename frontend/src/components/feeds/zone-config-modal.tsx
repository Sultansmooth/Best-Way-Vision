'use client'

import { useState, useRef, useEffect } from 'react'
import { Zone, Point, ZoneConfig } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Trash2, Check } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ZoneConfigModalProps {
  zone: Zone | null
  cameraId?: string
  onSave: (zone: Omit<Zone, 'id'> | Zone) => void
  onDelete?: (zoneId: string) => void
  onClose: () => void
}

export function ZoneConfigModal({ zone, cameraId, onSave, onDelete, onClose }: ZoneConfigModalProps) {
  const [name, setName] = useState(zone?.name || '')
  const [type, setType] = useState<'pallet_scan' | 'trailer_dock' | 'security'>(
    zone?.type || 'pallet_scan'
  )
  const [color, setColor] = useState(zone?.color || '#8b5cf6')
  const [enabled, setEnabled] = useState(zone?.enabled ?? true)
  const [coordinates, setCoordinates] = useState<Point[]>(zone?.coordinates || [])
  const [config, setConfig] = useState<ZoneConfig>(zone?.config || {})

  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Draw zone on canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw placeholder camera view
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Camera View', canvas.width / 2, canvas.height / 2)

    // Draw current zone
    if (coordinates.length > 0) {
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.fillStyle = color + '30'

      ctx.beginPath()
      coordinates.forEach((point, index) => {
        const x = (point.x / 100) * canvas.width
        const y = (point.y / 100) * canvas.height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      if (coordinates.length > 2) {
        ctx.closePath()
        ctx.fill()
      }
      ctx.stroke()

      // Draw points
      coordinates.forEach(point => {
        const x = (point.x / 100) * canvas.width
        const y = (point.y / 100) * canvas.height

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      })
    }
  }, [coordinates, color])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setCoordinates([...coordinates, { x, y }])
  }

  const handleClearZone = () => {
    setCoordinates([])
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a zone name')
      return
    }

    if (coordinates.length < 3) {
      alert('Please draw a zone with at least 3 points')
      return
    }

    const zoneData: Omit<Zone, 'id'> = {
      name,
      cameraId: zone?.cameraId || cameraId || '',
      type,
      coordinates,
      color,
      enabled,
      config,
    }

    if (zone) {
      onSave({ ...zone, ...zoneData })
    } else {
      onSave(zoneData)
    }
  }

  const typeColors = {
    pallet_scan: '#8b5cf6',
    trailer_dock: '#10b981',
    security: '#ef4444',
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {zone ? 'Edit Zone' : 'Add New Zone'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Drawing Canvas */}
          <div ref={containerRef}>
            <Label className="text-gray-800">Draw Zone (click to add points)</Label>
            <div className="mt-2 relative">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full border rounded cursor-crosshair bg-gray-900"
                onClick={handleCanvasClick}
              />
              {coordinates.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleClearZone}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear Zone
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-800 mt-1">
              Click on the canvas to add zone boundary points. Need at least 3 points.
              {coordinates.length > 0 && ` (${coordinates.length} points added)`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Zone Name */}
            <div>
              <Label htmlFor="zone-name" className="text-gray-800">Zone Name</Label>
              <Input
                id="zone-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Dock 1 Detection Zone"
                className="mt-1"
              />
            </div>

            {/* Zone Type */}
            <div>
              <Label htmlFor="zone-type" className="text-gray-800">Zone Type</Label>
              <Select
                value={type}
                onValueChange={(value: any) => {
                  setType(value)
                  setColor(typeColors[value as keyof typeof typeColors])
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pallet_scan">Pallet Scan</SelectItem>
                  <SelectItem value="trailer_dock">Trailer Dock</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div>
              <Label htmlFor="zone-color" className="text-gray-800">Zone Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="zone-color"
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input value={color} readOnly className="flex-1" />
              </div>
            </div>

            {/* Enabled */}
            <div className="flex items-center gap-2 pt-7">
              <input
                id="zone-enabled"
                type="checkbox"
                checked={enabled}
                onChange={e => setEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="zone-enabled" className="text-gray-800">
                Zone Enabled
              </Label>
            </div>
          </div>

          {/* Type-specific configuration */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Zone Configuration</h3>

            {type === 'pallet_scan' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-cartons" className="text-gray-800">Min Carton Count</Label>
                  <Input
                    id="min-cartons"
                    type="number"
                    value={config.minCartonCount || 1}
                    onChange={e => setConfig({ ...config, minCartonCount: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="max-cartons" className="text-gray-800">Max Carton Count</Label>
                  <Input
                    id="max-cartons"
                    type="number"
                    value={config.maxCartonCount || 100}
                    onChange={e => setConfig({ ...config, maxCartonCount: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="direction" className="text-gray-800">Counting Direction</Label>
                  <Select
                    value={config.countingDirection || 'in'}
                    onValueChange={(value: any) => setConfig({ ...config, countingDirection: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">In</SelectItem>
                      <SelectItem value="out">Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {type === 'trailer_dock' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dock-number" className="text-gray-800">Dock Number</Label>
                  <Input
                    id="dock-number"
                    value={config.dockNumber || ''}
                    onChange={e => setConfig({ ...config, dockNumber: e.target.value })}
                    placeholder="e.g., 1"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <input
                    id="detect-direction"
                    type="checkbox"
                    checked={config.detectDirection ?? true}
                    onChange={e => setConfig({ ...config, detectDirection: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="detect-direction" className="text-gray-800">
                    Detect Direction
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="ocr-enabled"
                    type="checkbox"
                    checked={config.ocrEnabled ?? true}
                    onChange={e => setConfig({ ...config, ocrEnabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="ocr-enabled" className="text-gray-800">
                    OCR Enabled (Trailer Name)
                  </Label>
                </div>
              </div>
            )}

            {type === 'security' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="alert-type" className="text-gray-800">Alert Type</Label>
                  <Select
                    value={config.alertType || 'unauthorized_personnel'}
                    onValueChange={(value: any) => setConfig({ ...config, alertType: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unauthorized_personnel">Unauthorized Personnel</SelectItem>
                      <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                      <SelectItem value="restricted_area">Restricted Area</SelectItem>
                      <SelectItem value="after_hours">After Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity" className="text-gray-800">Severity</Label>
                  <Select
                    value={config.severity || 'medium'}
                    onValueChange={(value: any) => setConfig({ ...config, severity: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    id="schedule-enabled"
                    type="checkbox"
                    checked={config.scheduleEnabled ?? false}
                    onChange={e => setConfig({ ...config, scheduleEnabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="schedule-enabled" className="text-gray-800">
                    Schedule-based Alerts
                  </Label>
                </div>
                {config.scheduleEnabled && (
                  <>
                    <div>
                      <Label htmlFor="active-start" className="text-gray-800">Active Start Time</Label>
                      <Input
                        id="active-start"
                        type="time"
                        value={config.activeHours?.start || '18:00'}
                        onChange={e => setConfig({
                          ...config,
                          activeHours: { ...config.activeHours, start: e.target.value } as any
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="active-end" className="text-gray-800">Active End Time</Label>
                      <Input
                        id="active-end"
                        type="time"
                        value={config.activeHours?.end || '06:00'}
                        onChange={e => setConfig({
                          ...config,
                          activeHours: { ...config.activeHours, end: e.target.value } as any
                        })}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {zone && onDelete && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this zone?')) {
                    onDelete(zone.id)
                  }
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Zone
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Zone
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
