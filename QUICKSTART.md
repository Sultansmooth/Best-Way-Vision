# Best Way Vision - Quick Start Guide

## What You Have

A **complete, professional Next.js frontend application** for warehouse monitoring with:
- Dashboard with real-time statistics
- Event listing with search, filters, and export
- Event detail pages for all event types
- Admin panel for email configuration
- Mock data system (works standalone, no backend needed yet)
- Professional UI with Best Way branding

## Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

### 3. Explore the Application

**Dashboard** (`/`)
- View statistics: Events today, pallets scanned, trailers, security alerts
- See recent events with thumbnails
- Refresh data with button

**Events** (`/events`)
- Browse all events with tabs (All, Pallets, Trailers, Security)
- Use search bar to find specific events
- Apply filters (date range, location, severity)
- Export to CSV or Excel
- Click any event to view details

**Event Details** (`/events/[event-id]`)
- View full event information
- See large snapshot image
- Export single event

**Admin** (`/admin`)
- Configure SMTP settings
- Set report schedule (daily/weekly/monthly)
- Manage email recipients
- Send test email

### 4. Understanding Mock Data

The app generates **30 days of realistic events**:
- 50% Pallet events (carton counts)
- 35% Trailer events (arrivals/departures)
- 15% Security events (alerts)

Data is stored in **localStorage** - it persists between sessions!

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Pages (Dashboard, Events, Admin)
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI (buttons, cards, etc.)
│   │   ├── dashboard/        # Dashboard components
│   │   ├── events/           # Event components
│   │   ├── layout/           # Navigation
│   │   └── shared/           # Search, Export
│   ├── lib/                   # Utilities & API
│   │   ├── api.ts           # API client (mock data)
│   │   ├── mock-data.ts     # Data generator
│   │   ├── export.ts        # CSV/Excel export
│   │   └── utils.ts         # Helper functions
│   └── types/                 # TypeScript types
│       ├── events.ts         # Event definitions
│       └── admin.ts          # Admin types
```

## Key Features

### Event Types

**Pallet Events**
- Carton count
- Zone/location
- Timestamp
- Camera ID
- Snapshot

**Trailer Events**
- Trailer name (OCR)
- Direction (arrival/departure)
- Dock number
- Timestamp
- Snapshot

**Security Events**
- Alert type
- Severity (low/medium/high)
- Description
- Timestamp
- Snapshot

### Search & Filter
- Full-text search across all fields
- Filter by date range
- Filter by location
- Filter by event type (tabs)
- Filter by severity (security events)

### Export
- Export to CSV (comma-separated)
- Export to Excel (.xlsx with formatting)
- Export all events or filtered results
- Timestamped filenames

## Backend Integration (Future)

When Python backend is ready, simply update `src/lib/api.ts`:

**Current (Mock):**
```typescript
export async function getEvents() {
  await delay(200)
  return mockEvents
}
```

**Future (Real API):**
```typescript
export async function getEvents(filters?: EventFilters) {
  const response = await fetch('/api/v1/events', {
    method: 'POST',
    body: JSON.stringify(filters),
  })
  return response.json()
}
```

No UI changes needed!

## Production Build

```bash
npm run build
npm start
```

## Docker Deployment (Future)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Documentation

- `/docs/FRONTEND-ARCHITECTURE.md` - Architecture details
- `/docs/FRONTEND-COMPLETE.md` - Complete feature list
- `/docs/PROJECT-INFO.md` - Project overview & log
- `/docs/Project Overview.md` - High-level requirements

## Support

For questions:
1. Check TypeScript types in `/src/types/`
2. Review component code in `/src/components/`
3. Check API contracts in `/src/lib/api.ts`

## Next Steps

1. **Test the frontend**: Run it, explore all features
2. **Develop Python backend**: NVR connection, AI/CV, database
3. **Integrate**: Connect frontend API calls to real backend
4. **Deploy**: Containerize and deploy to on-premise server
5. **Connect NVR**: Link to actual camera feeds

---

**Status:** Frontend is 100% complete and functional!

Ready for backend development to begin.
