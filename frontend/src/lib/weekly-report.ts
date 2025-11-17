import { Event, PalletEvent, TrailerEvent, SecurityEvent } from '@/types'
import { formatDateTime } from './utils'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface WeeklyReportData {
  weekStart: Date
  weekEnd: Date
  eventsByDay: {
    date: string
    dayOfWeek: string
    events: Event[]
    summary: {
      pallets: number
      trailers: number
      security: number
      total: number
    }
  }[]
  weekTotal: {
    pallets: number
    trailers: number
    security: number
    total: number
  }
}

export function generateWeeklyReport(events: Event[]): WeeklyReportData {
  // Get current week (Monday to Sunday)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + mondayOffset)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  // Group events by day
  const eventsByDay = []
  let weekTotal = { pallets: 0, trailers: 0, security: 0, total: 0 }

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart)
    currentDay.setDate(weekStart.getDate() + i)

    const nextDay = new Date(currentDay)
    nextDay.setDate(currentDay.getDate() + 1)

    const dayEvents = events.filter(
      e => e.timestamp >= currentDay && e.timestamp < nextDay
    )

    const pallets = dayEvents.filter(e => e.type === 'pallet').length
    const trailers = dayEvents.filter(e => e.type === 'trailer').length
    const security = dayEvents.filter(e => e.type === 'security').length

    weekTotal.pallets += pallets
    weekTotal.trailers += trailers
    weekTotal.security += security
    weekTotal.total += dayEvents.length

    eventsByDay.push({
      date: currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayOfWeek: currentDay.toLocaleDateString('en-US', { weekday: 'long' }),
      events: dayEvents,
      summary: {
        pallets,
        trailers,
        security,
        total: dayEvents.length
      }
    })
  }

  return {
    weekStart,
    weekEnd,
    eventsByDay,
    weekTotal
  }
}

export function exportWeeklyReportToPDF(reportData: WeeklyReportData) {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(34, 197, 94) // Green color
  doc.text('Best Way Vision', 14, 20)

  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Weekly Activity Report', 14, 30)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(
    `${reportData.weekStart.toLocaleDateString()} - ${reportData.weekEnd.toLocaleDateString()}`,
    14,
    37
  )

  // Summary Table
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Weekly Summary', 14, 50)

  autoTable(doc, {
    startY: 55,
    head: [['Metric', 'Count']],
    body: [
      ['Total Events', reportData.weekTotal.total.toString()],
      ['Pallet Scans', reportData.weekTotal.pallets.toString()],
      ['Trailer Activity', reportData.weekTotal.trailers.toString()],
      ['Security Alerts', reportData.weekTotal.security.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
  })

  // Daily Breakdown
  doc.text('Daily Breakdown', 14, (doc as any).lastAutoTable.finalY + 15)

  const dailyData = reportData.eventsByDay.map(day => [
    day.dayOfWeek,
    day.date,
    day.summary.total.toString(),
    day.summary.pallets.toString(),
    day.summary.trailers.toString(),
    day.summary.security.toString(),
  ])

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Day', 'Date', 'Total', 'Pallets', 'Trailers', 'Security']],
    body: dailyData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
  })

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages()
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    `Generated on ${new Date().toLocaleString()}`,
    14,
    doc.internal.pageSize.height - 10
  )
  doc.text(
    `Page ${pageCount}`,
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 10
  )

  // Save
  const filename = `weekly-report-${reportData.weekStart.toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
