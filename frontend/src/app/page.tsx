'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/types'
import { getEvents, getTrendData, TrendData } from '@/lib/api'
import { TrendChart } from '@/components/dashboard/trend-chart'
import { EventCard } from '@/components/events/event-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Truck, Shield, Activity, RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function DashboardPage() {
  const [trends, setTrends] = useState<TrendData | null>(null)
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      const [trendData, eventsData] = await Promise.all([
        getTrendData(7),
        getEvents(),
      ])
      setTrends(trendData)
      setRecentEvents(eventsData.slice(0, 5)) // Show 5 most recent
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-700 mt-1">7-day trend analysis</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Trend Charts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[280px] w-full" />
          ))}
        </div>
      ) : trends ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TrendChart
            title="Total Events"
            data={trends.total}
            icon={Activity}
            color="#3b82f6"
          />
          <TrendChart
            title="Pallet Scans"
            data={trends.pallets}
            icon={Package}
            color="#8b5cf6"
          />
          <TrendChart
            title="Trailer Activity"
            data={trends.trailers}
            icon={Truck}
            color="#10b981"
          />
          <TrendChart
            title="Security Alerts"
            data={trends.security}
            icon={Shield}
            color="#ef4444"
          />
        </div>
      ) : null}

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest warehouse activity</CardDescription>
            </div>
            <Link href="/events">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <p className="text-center text-gray-700 py-8">No events yet</p>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
