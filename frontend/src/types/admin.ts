// Email configuration for admin settings
export interface EmailConfig {
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  recipients: string[] // Email addresses to send reports to
  reportSchedule: 'daily' | 'weekly' | 'monthly'
  reportTime: string // HH:MM format
}
