# Frontend Architecture - Best Way Vision

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context + hooks
- **Data Fetching**: React Server Components + API routes (mock data initially)
- **Export**: xlsx library for Excel exports
- **Date Handling**: date-fns

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard (/)
│   │   ├── events/            # Events listing
│   │   ├── admin/             # Admin settings
│   │   └── api/               # API routes (mock initially)
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui base components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── events/            # Event-related components
│   │   ├── layout/            # Layout components (Navbar, Sidebar)
│   │   └── shared/            # Shared components (Search, Export)
│   ├── lib/                   # Utilities and helpers
│   │   ├── api.ts            # API client functions
│   │   ├── mock-data.ts      # Mock data generator
│   │   ├── export.ts         # Export utilities
│   │   └── utils.ts          # General utilities
│   ├── types/                 # TypeScript type definitions
│   │   ├── events.ts         # Event type definitions
│   │   └── index.ts          # Barrel exports
│   ├── contexts/              # React contexts
│   │   └── EventFilterContext.tsx
│   └── hooks/                 # Custom React hooks
│       ├── useEvents.ts
│       └── useSearch.ts
├── public/                    # Static assets
└── package.json
```

## Event System Design

### Event Types

#### 1. Pallet Event
- **Type**: `pallet`
- **Data**:
  - Event ID (UUID)
  - Timestamp
  - Location (zone/area in building)
  - Carton count
  - Snapshot image URL
  - Camera ID

#### 2. Trailer Event
- **Type**: `trailer`
- **Data**:
  - Event ID (UUID)
  - Timestamp
  - Location (dock number)
  - Trailer name/ID (OCR from side)
  - Direction (arrival/departure)
  - Snapshot image URL
  - Camera ID

#### 3. Security Event
- **Type**: `security`
- **Data**:
  - Event ID (UUID)
  - Timestamp
  - Location (zone/area)
  - Alert type (unauthorized personnel, suspicious activity, etc.)
  - Severity (low/medium/high)
  - Snapshot image URL
  - Camera ID

### Unified Event Interface

```typescript
interface BaseEvent {
  id: string
  type: 'pallet' | 'trailer' | 'security'
  timestamp: Date
  location: string
  cameraId: string
  snapshotUrl?: string
}

interface PalletEvent extends BaseEvent {
  type: 'pallet'
  cartonCount: number
}

interface TrailerEvent extends BaseEvent {
  type: 'trailer'
  trailerName?: string
  direction: 'arrival' | 'departure'
}

interface SecurityEvent extends BaseEvent {
  type: 'security'
  alertType: string
  severity: 'low' | 'medium' | 'high'
}

type Event = PalletEvent | TrailerEvent | SecurityEvent
```

## Features

### 1. Dashboard
- Real-time event statistics
- Recent events feed
- Event count by type (today, this week)
- Quick filters

### 2. Event Listing
- Tabbed interface (All, Pallets, Trailers, Security)
- Filterable by date range, location, type
- Searchable (full-text search)
- Sortable columns
- Pagination
- Event cards with key info + thumbnail

### 3. Event Detail
- Full event information
- Large snapshot image
- Related events (same location/time)
- Export single event

### 4. Search
- Global search bar
- Filter by:
  - Event type
  - Date range
  - Location
  - Keywords (trailer name, alert type, etc.)
- Search results with highlighting

### 5. Export
- Export to CSV
- Export to Excel (with formatting)
- Date range selection
- Event type selection
- Includes snapshot URLs (not embedded images)

### 6. Admin Settings
- Email configuration (SMTP settings)
- Report recipients
- Report schedule (daily/weekly)
- Test email function

## UI/UX Design Principles

### Professional & Clean
- Minimal, modern design
- Best Way branding (colors, logo)
- Consistent spacing and typography
- Clear visual hierarchy

### Performance
- Virtualized lists for large datasets
- Lazy loading images
- Optimistic UI updates
- Loading skeletons (no spinners)

### Accessibility
- Keyboard navigation
- ARIA labels
- High contrast ratios
- Responsive design (desktop-first, mobile-friendly)

### User Experience
- Toast notifications for actions
- Confirmation dialogs for destructive actions
- Skeleton loaders for loading states
- Error boundaries for graceful failures
- Empty states with helpful messages

## Mock Data Strategy

Until backend is ready:
- Generate realistic mock data on app load
- Persist in memory (localStorage for persistence)
- Simulate API delays (200-500ms)
- Random snapshot URLs (placeholder images)

## API Integration (Future)

```typescript
// lib/api.ts structure
export async function getEvents(filters?: EventFilters): Promise<Event[]>
export async function getEvent(id: string): Promise<Event>
export async function exportEvents(filters?: EventFilters): Promise<Blob>
export async function sendTestEmail(): Promise<void>
export async function saveEmailConfig(config: EmailConfig): Promise<void>
```

## Development Approach

1. Build with mock data first
2. Implement all UI components and features
3. Test thoroughly with realistic data
4. Backend integration is simple swap: mock API → real API
5. No UI changes needed when backend connects

## Next Steps

1. Initialize Next.js project
2. Set up Tailwind + shadcn/ui
3. Create type definitions
4. Build mock data generator
5. Implement Dashboard
6. Build Event Listing & Detail views
7. Add Search & Export
8. Create Admin settings
9. Polish and test
