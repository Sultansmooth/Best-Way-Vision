'use client'

import { Event, PalletEvent, TrailerEvent, SecurityEvent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Truck, Shield, MapPin, Camera } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case 'pallet':
        return <Package className="h-5 w-5 text-blue-600" />
      case 'trailer':
        return <Truck className="h-5 w-5 text-green-600" />
      case 'security':
        return <Shield className="h-5 w-5 text-red-600" />
    }
  }

  const getEventBadge = () => {
    switch (event.type) {
      case 'pallet':
        return <Badge variant="default">Pallet</Badge>
      case 'trailer':
        return <Badge variant="success">Trailer</Badge>
      case 'security':
        const severity = (event as SecurityEvent).severity
        return (
          <Badge
            variant={
              severity === 'high' ? 'destructive' : severity === 'medium' ? 'warning' : 'secondary'
            }
          >
            Security - {severity}
          </Badge>
        )
    }
  }

  const getEventDetails = () => {
    switch (event.type) {
      case 'pallet':
        const pe = event as PalletEvent
        return `${pe.cartonCount} cartons • ${pe.zone}`
      case 'trailer':
        const te = event as TrailerEvent
        return `${te.direction === 'arrival' ? 'Arrival' : 'Departure'} • ${te.trailerName || 'Unknown'}`
      case 'security':
        const se = event as SecurityEvent
        return se.description || se.alertType.replace('_', ' ')
    }
  }

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">{getEventIcon()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                {getEventBadge()}
                <span className="text-sm text-gray-700">{formatDateTime(event.timestamp)}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{getEventDetails()}</p>
              <div className="flex items-center text-xs text-gray-700 space-x-3">
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {event.location}
                </span>
                <span className="flex items-center">
                  <Camera className="h-3 w-3 mr-1" />
                  {event.cameraId}
                </span>
              </div>
            </div>
            {event.snapshotUrl && (
              <div className="flex-shrink-0">
                <img
                  src={event.snapshotUrl}
                  alt="Event snapshot"
                  className="h-16 w-16 rounded object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
