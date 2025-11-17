'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { LucideIcon } from 'lucide-react'

interface TrendDataPoint {
  date: string
  value: number
}

interface TrendChartProps {
  title: string
  data: TrendDataPoint[]
  icon: LucideIcon
  color?: string
  totalLabel?: string
}

export function TrendChart({ title, data, icon: Icon, color = '#3b82f6', totalLabel }: TrendChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const average = data.length > 0 ? (total / data.length).toFixed(2) : '0'

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-800">{title}</CardTitle>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900">{average}</div>
          <p className="text-xs text-gray-700 mt-1">
            {totalLabel || 'Average'} per day
          </p>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#374151' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#374151' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
