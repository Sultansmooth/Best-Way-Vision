'use client'

import { useEffect, useState } from 'react'
import { exportWeeklyReportToPDF, WeeklyReportData } from '@/lib/weekly-report'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Download, X } from 'lucide-react'

// Generate template event data for mockup
interface TemplateEvent {
  id: string
  timestamp: Date
  type: 'pallet' | 'trailer' | 'security'
  location: string
  cameraId: string
  details: string
  imageUrl: string
  cartonCount?: number
  trailerNumber?: string
  alertType?: string
}

function generateTemplateEvents(): TemplateEvent[] {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + mondayOffset)
  weekStart.setHours(0, 0, 0, 0)

  const events: TemplateEvent[] = []
  const locations = ['Dock 1', 'Dock 2', 'Dock 3', 'Warehouse A', 'Warehouse B']
  const trailerCompanies = ['Swift', 'FedEx', 'UPS', 'XPO', 'JB Hunt']

  let eventCounter = 1

  // Generate events for each day (more on weekdays, less on weekends)
  const dailyCounts = [
    { pallets: 18, trailers: 12, security: 15 }, // Monday
    { pallets: 22, trailers: 15, security: 15 }, // Tuesday
    { pallets: 20, trailers: 13, security: 15 }, // Wednesday
    { pallets: 21, trailers: 14, security: 15 }, // Thursday
    { pallets: 24, trailers: 16, security: 15 }, // Friday
    { pallets: 10, trailers: 8, security: 10 },  // Saturday
    { pallets: 5, trailers: 3, security: 4 }     // Sunday
  ]

  dailyCounts.forEach((dayCounts, dayIndex) => {
    const currentDay = new Date(weekStart)
    currentDay.setDate(weekStart.getDate() + dayIndex)

    // Generate pallet events
    for (let i = 0; i < dayCounts.pallets; i++) {
      const eventTime = new Date(currentDay)
      eventTime.setHours(8 + Math.floor(Math.random() * 10))
      eventTime.setMinutes(Math.floor(Math.random() * 60))

      const cartonCount = Math.floor(Math.random() * 90) + 10
      events.push({
        id: `EVT-${String(eventCounter++).padStart(5, '0')}`,
        timestamp: eventTime,
        type: 'pallet',
        location: locations[Math.floor(Math.random() * 3)],
        cameraId: `CAM-${String(Math.floor(Math.random() * 3) + 1).padStart(3, '0')}`,
        cartonCount,
        details: `${cartonCount} cartons scanned in Zone A`,
        imageUrl: `https://placehold.co/800x600/9333ea/white?text=Pallet+Scan+${cartonCount}+Cartons`
      })
    }

    // Generate trailer events
    for (let i = 0; i < dayCounts.trailers; i++) {
      const eventTime = new Date(currentDay)
      eventTime.setHours(8 + Math.floor(Math.random() * 10))
      eventTime.setMinutes(Math.floor(Math.random() * 60))

      const trailerNum = `${trailerCompanies[Math.floor(Math.random() * trailerCompanies.length)]}-${Math.floor(Math.random() * 9000) + 1000}`
      const direction = Math.random() > 0.5 ? 'arrival' : 'departure'
      events.push({
        id: `EVT-${String(eventCounter++).padStart(5, '0')}`,
        timestamp: eventTime,
        type: 'trailer',
        location: locations[Math.floor(Math.random() * 3)],
        cameraId: `CAM-${String(Math.floor(Math.random() * 3) + 4).padStart(3, '0')}`,
        trailerNumber: trailerNum,
        details: `Trailer ${trailerNum} ${direction}`,
        imageUrl: `https://placehold.co/800x600/16a34a/white?text=Trailer+${trailerNum.replace('-', '+')}`
      })
    }

    // Generate security events
    for (let i = 0; i < dayCounts.security; i++) {
      const eventTime = new Date(currentDay)
      eventTime.setHours(Math.floor(Math.random() * 24))
      eventTime.setMinutes(Math.floor(Math.random() * 60))

      const alertTypes = ['Unauthorized Access', 'After Hours Activity', 'Restricted Area', 'Suspicious Behavior']
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      events.push({
        id: `EVT-${String(eventCounter++).padStart(5, '0')}`,
        timestamp: eventTime,
        type: 'security',
        location: locations[Math.floor(Math.random() * locations.length)],
        cameraId: `CAM-${String(Math.floor(Math.random() * 3) + 7).padStart(3, '0')}`,
        alertType,
        details: `${alertType} detected`,
        imageUrl: `https://placehold.co/800x600/dc2626/white?text=${alertType.replace(/\s+/g, '+')}`
      })
    }
  })

  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export default function ReportsPage() {
  const [events, setEvents] = useState<TemplateEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<TemplateEvent | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    // Load template events
    const templateEvents = generateTemplateEvents()
    setEvents(templateEvents)
    setLoading(false)
  }, [])

  const handleEventClick = (event: TemplateEvent) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedEvent(null)
  }

  const palletEvents = events.filter(e => e.type === 'pallet')
  const trailerEvents = events.filter(e => e.type === 'trailer')
  const securityEvents = events.filter(e => e.type === 'security')

  // Calculate week dates
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + mondayOffset)
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  const handleExportPDF = () => {
    // For now, just alert - will implement full PDF export later
    alert('PDF export feature will be implemented with detailed event data')
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-16 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Weekly Report</h1>
            <p className="text-gray-800 mt-1">
              {`${weekStart.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })} - ${weekEnd.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}`}
            </p>
          </div>
          <Button onClick={handleExportPDF} disabled={events.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        {/* Weekly Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {events.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Pallet Scans</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {palletEvents.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-purple-600 rounded" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Trailer Activity</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {trailerEvents.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Security Alerts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {securityEvents.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-600 rounded" />
              </div>
            </div>
          </Card>
        </div>

        {/* Pallet Scans Breakdown */}
        <Card className="overflow-hidden">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-200">
            <h2 className="text-lg font-semibold text-gray-800">Pallet Scans ({palletEvents.length} Events)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Event ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Camera ID
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Carton Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {palletEvents.map((event, index) => (
                  <tr
                    key={index}
                    onClick={() => handleEventClick(event)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{event.id}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {event.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' '}
                        {event.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{event.location}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-800">{event.cameraId}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                        {event.cartonCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-800">{event.details}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Trailer Activity Breakdown */}
        <Card className="overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-200">
            <h2 className="text-lg font-semibold text-gray-800">Trailer Activity ({trailerEvents.length} Events)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Event ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Camera ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Trailer Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trailerEvents.map((event, index) => (
                  <tr
                    key={index}
                    onClick={() => handleEventClick(event)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{event.id}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {event.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' '}
                        {event.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{event.location}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-800">{event.cameraId}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{event.trailerNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-800">{event.details}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Security Alerts Breakdown */}
        <Card className="overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-200">
            <h2 className="text-lg font-semibold text-gray-800">Security Alerts ({securityEvents.length} Events)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Event ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Camera ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Alert Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {securityEvents.map((event, index) => (
                  <tr
                    key={index}
                    onClick={() => handleEventClick(event)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{event.id}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {event.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' '}
                        {event.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{event.location}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-800">{event.cameraId}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                        {event.alertType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-800">{event.details}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-800">
            <strong>Template Report:</strong> This is a mockup showing the Excel-style weekly report format with sample data (290 total events across the week).
            Each category is broken down into individual event records with Event ID, timestamp, location, camera ID, and category-specific details.
            Click on any row to view the event snapshot image. Once the backend is connected, this will display real event data from your warehouse monitoring system and can be exported to Excel format.
          </p>
        </div>
      </div>

      {/* Image Modal */}
      {modalOpen && selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>

            {/* Event Details */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.id}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type: </span>
                  <span className="font-semibold text-gray-900 capitalize">{selectedEvent.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Location: </span>
                  <span className="font-semibold text-gray-900">{selectedEvent.location}</span>
                </div>
                <div>
                  <span className="text-gray-600">Camera: </span>
                  <span className="font-mono text-gray-900">{selectedEvent.cameraId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Time: </span>
                  <span className="text-gray-900">
                    {selectedEvent.timestamp.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              {selectedEvent.type === 'pallet' && (
                <div className="mt-2">
                  <span className="text-gray-600">Carton Count: </span>
                  <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                    {selectedEvent.cartonCount}
                  </span>
                </div>
              )}
              {selectedEvent.type === 'trailer' && (
                <div className="mt-2">
                  <span className="text-gray-600">Trailer: </span>
                  <span className="font-semibold text-gray-900">{selectedEvent.trailerNumber}</span>
                </div>
              )}
              {selectedEvent.type === 'security' && (
                <div className="mt-2">
                  <span className="text-gray-600">Alert Type: </span>
                  <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                    {selectedEvent.alertType}
                  </span>
                </div>
              )}
            </div>

            {/* Event Image */}
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img
                src={selectedEvent.imageUrl}
                alt={`Event ${selectedEvent.id}`}
                className="w-full h-auto"
              />
            </div>

            {/* Event Details Text */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-800">{selectedEvent.details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
