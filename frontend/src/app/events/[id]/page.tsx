'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Event, PalletEvent, TrailerEvent, SecurityEvent } from '@/types'
import { getEvent } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, MapPin, Camera, Calendar, Package, Truck, Shield, Download } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { downloadCSV } from '@/lib/export'
import Link from 'next/link'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEvent(params.id as string)
        setEvent(data)
      } catch (error) {
        console.error('Failed to load event:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [params.id])

  const handleExport = () => {
    if (event) {
      downloadCSV([event], `event-${event.id}.csv`)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-800 text-lg">Event not found</p>
          <Link href="/events">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getEventIcon = () => {
    switch (event.type) {
      case 'pallet':
        return <Package className="h-6 w-6 text-blue-600" />
      case 'trailer':
        return <Truck className="h-6 w-6 text-green-600" />
      case 'security':
        return <Shield className="h-6 w-6 text-red-600" />
    }
  }

  const getEventBadge = () => {
    switch (event.type) {
      case 'pallet':
        return <Badge variant="default">Pallet Event</Badge>
      case 'trailer':
        return <Badge variant="success">Trailer Event</Badge>
      case 'security':
        const se = event as SecurityEvent
        return (
          <Badge
            variant={
              se.severity === 'high' ? 'destructive' : se.severity === 'medium' ? 'warning' : 'secondary'
            }
          >
            Security Alert - {se.severity.toUpperCase()}
          </Badge>
        )
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/events">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {getEventIcon()}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
              <p className="text-gray-800 mt-1">{event.id}</p>
            </div>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Event Badge */}
      <div className="mb-6">{getEventBadge()}</div>

      {/* Event Image */}
      {event.snapshotUrl && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <img
              src={event.snapshotUrl}
              alt="Event snapshot"
              className="w-full h-auto rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Event Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Timestamp:</span>
              <span className="ml-auto font-medium">{formatDateTime(event.timestamp)}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Location:</span>
              <span className="ml-auto font-medium">{event.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Camera className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Camera ID:</span>
              <span className="ml-auto font-medium">{event.cameraId}</span>
            </div>
          </CardContent>
        </Card>

        {/* Type-specific information */}
        {event.type === 'pallet' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pallet Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Package className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Carton Count:</span>
                <span className="ml-auto font-medium text-xl text-blue-600">
                  {(event as PalletEvent).cartonCount}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Zone:</span>
                <span className="ml-auto font-medium">{(event as PalletEvent).zone}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {event.type === 'trailer' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trailer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Truck className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Trailer Name:</span>
                <span className="ml-auto font-medium">
                  {(event as TrailerEvent).trailerName || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Trailer Number:</span>
                <span className="ml-auto font-medium">
                  {(event as TrailerEvent).trailerNumber || 'N/A'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Direction:</span>
                <Badge
                  variant={
                    (event as TrailerEvent).direction === 'arrival' ? 'success' : 'secondary'
                  }
                  className="ml-auto"
                >
                  {(event as TrailerEvent).direction}
                </Badge>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Dock Number:</span>
                <span className="ml-auto font-medium">
                  {(event as TrailerEvent).dockNumber || 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {event.type === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Alert Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Shield className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Alert Type:</span>
                <span className="ml-auto font-medium">
                  {(event as SecurityEvent).alertType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Severity:</span>
                <Badge
                  variant={
                    (event as SecurityEvent).severity === 'high'
                      ? 'destructive'
                      : (event as SecurityEvent).severity === 'medium'
                      ? 'warning'
                      : 'secondary'
                  }
                  className="ml-auto"
                >
                  {(event as SecurityEvent).severity.toUpperCase()}
                </Badge>
              </div>
              {(event as SecurityEvent).description && (
                <div className="text-sm pt-2 border-t">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 font-medium">{(event as SecurityEvent).description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
