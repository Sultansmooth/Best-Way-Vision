'use client'

import { EventFilters } from '@/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface EventFiltersProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
}

export function EventFiltersComponent({ filters, onFiltersChange }: EventFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.startDate || filters.endDate || filters.location || filters.severity
  )

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      startDate: undefined,
      endDate: undefined,
      location: undefined,
      severity: undefined,
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                startDate: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                endDate: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="Filter by location..."
            value={filters.location || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                location: e.target.value || undefined,
              })
            }
          />
        </div>

        {filters.type === 'security' && (
          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <select
              id="severity"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              value={filters.severity || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  severity: (e.target.value || undefined) as 'low' | 'medium' | 'high' | undefined,
                })
              }
            >
              <option value="">All severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
