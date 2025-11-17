'use client'

import { useEffect, useState } from 'react'
import { Event, EventFilters } from '@/types'
import { getEvents } from '@/lib/api'
import { EventCard } from '@/components/events/event-card'
import { EventFiltersComponent } from '@/components/events/event-filters'
import { SearchBar } from '@/components/shared/search-bar'
import { ExportButton } from '@/components/shared/export-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState<EventFilters>({
    type: 'all',
  })

  const loadEvents = async () => {
    try {
      const data = await getEvents(filters)
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [filters])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadEvents()
  }

  const handleSearch = (query: string) => {
    setFilters({ ...filters, searchQuery: query })
  }

  const handleTabChange = (value: string) => {
    setFilters({ ...filters, type: value as any })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-700 mt-1">View and manage all warehouse events</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportButton events={filteredEvents} disabled={loading} />
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar
            value={filters.searchQuery || ''}
            onChange={handleSearch}
            placeholder="Search by location, trailer name, camera ID..."
          />
        </div>

        {/* Filters */}
        <EventFiltersComponent filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={filters.type || 'all'} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All Events
            {!loading && <span className="ml-2 text-xs">({events.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="pallet">
            Pallets
            {!loading && (
              <span className="ml-2 text-xs">
                ({events.filter(e => e.type === 'pallet').length})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="trailer">
            Trailers
            {!loading && (
              <span className="ml-2 text-xs">
                ({events.filter(e => e.type === 'trailer').length})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="security">
            Security
            {!loading && (
              <span className="ml-2 text-xs">
                ({events.filter(e => e.type === 'security').length})
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filters.type || 'all'}>
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg">No events found</p>
              <p className="text-gray-800 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Results count */}
      {!loading && filteredEvents.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-700">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      )}
    </div>
  )
}
