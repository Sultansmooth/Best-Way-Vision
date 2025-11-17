'use client'

import { useState } from 'react'
import { Event } from '@/types'
import { Button } from '@/components/ui/button'
import { Download, Calendar } from 'lucide-react'
import { downloadCSV, downloadExcel, exportDailyReport } from '@/lib/export'

interface ExportButtonProps {
  events: Event[]
  disabled?: boolean
}

export function ExportButton({ events, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'excel' | 'daily') => {
    setIsExporting(true)
    try {
      const timestamp = new Date().toISOString().split('T')[0]

      if (format === 'csv') {
        downloadCSV(events, `best-way-vision-events-${timestamp}.csv`)
      } else if (format === 'excel') {
        downloadExcel(events, `best-way-vision-events-${timestamp}.xlsx`)
      } else {
        // Daily report - events grouped by day
        exportDailyReport(events, `best-way-vision-daily-report-${timestamp}.xlsx`)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={() => handleExport('daily')}
        disabled={disabled || isExporting || events.length === 0}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Export Daily Report
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        disabled={disabled || isExporting || events.length === 0}
      >
        <Download className="h-4 w-4 mr-2" />
        Export All
      </Button>
    </div>
  )
}
