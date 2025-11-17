'use client'

import { useEffect, useState } from 'react'
import { EmailConfig } from '@/types'
import { getEmailConfig, saveEmailConfig, sendTestEmail } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Settings, Mail, Save, Send, Plus, X } from 'lucide-react'

export default function AdminPage() {
  const [config, setConfig] = useState<EmailConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [testSuccess, setTestSuccess] = useState(false)
  const [newRecipient, setNewRecipient] = useState('')

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await getEmailConfig()
        setConfig(data)
      } catch (error) {
        console.error('Failed to load config:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    setSaveSuccess(false)
    try {
      await saveEmailConfig(config)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save config:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    setTesting(true)
    setTestSuccess(false)
    try {
      await sendTestEmail()
      setTestSuccess(true)
      setTimeout(() => setTestSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to send test email:', error)
    } finally {
      setTesting(false)
    }
  }

  const addRecipient = () => {
    if (newRecipient && config && !config.recipients.includes(newRecipient)) {
      setConfig({
        ...config,
        recipients: [...config.recipients, newRecipient],
      })
      setNewRecipient('')
    }
  }

  const removeRecipient = (email: string) => {
    if (config) {
      setConfig({
        ...config,
        recipients: config.recipients.filter((r) => r !== email),
      })
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-700 text-lg">Failed to load configuration</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
            <p className="text-gray-700 mt-1">Configure email notifications and reports</p>
          </div>
        </div>
      </div>

      {/* Success Messages */}
      {saveSuccess && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800 font-medium">Settings saved successfully!</p>
        </div>
      )}
      {testSuccess && (
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800 font-medium">Test email sent successfully!</p>
        </div>
      )}

      <div className="space-y-6">
        {/* SMTP Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              SMTP Configuration
            </CardTitle>
            <CardDescription>Configure email server settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  type="text"
                  value={config.smtpHost}
                  onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                  placeholder="smtp.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={config.smtpPort}
                  onChange={(e) => setConfig({ ...config, smtpPort: parseInt(e.target.value) })}
                  placeholder="587"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  type="text"
                  value={config.smtpUsername}
                  onChange={(e) => setConfig({ ...config, smtpUsername: e.target.value })}
                  placeholder="your-email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={config.smtpPassword}
                  onChange={(e) => setConfig({ ...config, smtpPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={handleTestEmail} variant="outline" disabled={testing}>
                <Send className={`h-4 w-4 mr-2 ${testing ? 'animate-pulse' : ''}`} />
                {testing ? 'Sending...' : 'Send Test Email'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Configure automated report settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportSchedule">Report Schedule</Label>
                <select
                  id="reportSchedule"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={config.reportSchedule}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      reportSchedule: e.target.value as 'daily' | 'weekly' | 'monthly',
                    })
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportTime">Report Time (24h)</Label>
                <Input
                  id="reportTime"
                  type="time"
                  value={config.reportTime}
                  onChange={(e) => setConfig({ ...config, reportTime: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card>
          <CardHeader>
            <CardTitle>Email Recipients</CardTitle>
            <CardDescription>Manage who receives automated reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
              />
              <Button onClick={addRecipient} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.recipients.map((email) => (
                <Badge key={email} variant="secondary" className="pr-1">
                  <span className="mr-2">{email}</span>
                  <button
                    onClick={() => removeRecipient(email)}
                    className="hover:bg-gray-300 rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {config.recipients.length === 0 && (
              <p className="text-sm text-gray-700 italic">No recipients configured</p>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-pulse' : ''}`} />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
