import { Event, PalletEvent, TrailerEvent, SecurityEvent } from '@/types'
import { formatDateTime } from './utils'
import * as XLSX from 'xlsx'

// Convert events to CSV format
export function eventsToCSV(events: Event[]): string {
  if (events.length === 0) return ''

  // CSV headers
  const headers = [
    'ID',
    'Type',
    'Timestamp',
    'Location',
    'Camera ID',
    'Details',
    'Snapshot URL',
  ]

  // Convert events to rows
  const rows = events.map(event => {
    let details = ''

    switch (event.type) {
      case 'pallet':
        const pe = event as PalletEvent
        details = `Cartons: ${pe.cartonCount}, Zone: ${pe.zone}`
        break
      case 'trailer':
        const te = event as TrailerEvent
        details = `${te.direction === 'arrival' ? 'Arrival' : 'Departure'}, Trailer: ${te.trailerName || 'Unknown'}, Dock: ${te.dockNumber || 'N/A'}`
        break
      case 'security':
        const se = event as SecurityEvent
        details = `${se.alertType} (${se.severity}): ${se.description || ''}`
        break
    }

    return [
      event.id,
      event.type,
      formatDateTime(event.timestamp),
      event.location,
      event.cameraId,
      details,
      event.snapshotUrl || '',
    ]
  })

  // Combine into CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
}

// Convert events to Excel format
export function eventsToExcel(events: Event[]): XLSX.WorkBook {
  // Prepare data rows
  const data = events.map(event => {
    const base = {
      'Event ID': event.id,
      'Type': event.type.toUpperCase(),
      'Timestamp': formatDateTime(event.timestamp),
      'Location': event.location,
      'Camera ID': event.cameraId,
    }

    switch (event.type) {
      case 'pallet':
        const pe = event as PalletEvent
        return {
          ...base,
          'Carton Count': pe.cartonCount,
          'Zone': pe.zone,
          'Details': `${pe.cartonCount} cartons in ${pe.zone}`,
          'Snapshot URL': event.snapshotUrl || '',
        }
      case 'trailer':
        const te = event as TrailerEvent
        return {
          ...base,
          'Direction': te.direction,
          'Trailer Name': te.trailerName || '',
          'Trailer Number': te.trailerNumber || '',
          'Dock Number': te.dockNumber || '',
          'Details': `${te.direction} - ${te.trailerName || 'Unknown trailer'}`,
          'Snapshot URL': event.snapshotUrl || '',
        }
      case 'security':
        const se = event as SecurityEvent
        return {
          ...base,
          'Alert Type': se.alertType,
          'Severity': se.severity.toUpperCase(),
          'Description': se.description || '',
          'Details': `${se.severity.toUpperCase()} - ${se.alertType}`,
          'Snapshot URL': event.snapshotUrl || '',
        }
    }
  })

  // Create workbook
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Events')

  // Set column widths
  const maxWidth = 50
  worksheet['!cols'] = [
    { wch: 15 }, // Event ID
    { wch: 10 }, // Type
    { wch: 20 }, // Timestamp
    { wch: 20 }, // Location
    { wch: 12 }, // Camera ID
    { wch: 15 }, // Type-specific field 1
    { wch: 15 }, // Type-specific field 2
    { wch: 15 }, // Type-specific field 3
    { wch: 40 }, // Details
    { wch: maxWidth }, // Snapshot URL
  ]

  return workbook
}

// Download CSV file
export function downloadCSV(events: Event[], filename: string = 'events.csv') {
  const csv = eventsToCSV(events)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Download Excel file
export function downloadExcel(events: Event[], filename: string = 'events.xlsx') {
  const workbook = eventsToExcel(events)
  XLSX.writeFile(workbook, filename)
}

// Export events grouped by day (for daily reports)
export function exportDailyReport(events: Event[], filename: string = 'daily-report.xlsx') {
  if (events.length === 0) return

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.timestamp.toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  // Create workbook with multiple sheets (one per day)
  const workbook = XLSX.utils.book_new()

  Object.entries(eventsByDate).forEach(([date, dayEvents]) => {
    const data = dayEvents.map(event => {
      const base = {
        'Time': event.timestamp.toLocaleTimeString(),
        'Type': event.type.toUpperCase(),
        'Location': event.location,
        'Camera': event.cameraId,
      }

      switch (event.type) {
        case 'pallet':
          const pe = event as PalletEvent
          return {
            ...base,
            'Cartons': pe.cartonCount,
            'Zone': pe.zone,
            'Snapshot': event.snapshotUrl || '',
          }
        case 'trailer':
          const te = event as TrailerEvent
          return {
            ...base,
            'Trailer': te.trailerName || 'Unknown',
            'Direction': te.direction,
            'Dock': te.dockNumber || '',
            'Snapshot': event.snapshotUrl || '',
          }
        case 'security':
          const se = event as SecurityEvent
          return {
            ...base,
            'Alert': se.alertType,
            'Severity': se.severity.toUpperCase(),
            'Description': se.description || '',
            'Snapshot': event.snapshotUrl || '',
          }
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(data)
    const sheetName = date.replace(/\//g, '-')
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  })

  XLSX.writeFile(workbook, filename)
}
