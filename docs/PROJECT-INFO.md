# Best Way Vision - Project Information

## Repository
- **GitHub**: https://github.com/Sultansmooth/Best-Way-Vision
- **Project Directory**: `C:\Programming\Best Way Vision`

## Project Overview

AI-powered warehouse monitoring system using existing NVR and security cameras to automatically track pallets and trailers.

### Core Features
- **Pallet Carton Counting**: Count cartons on pallets in defined scan zones
- **Pallet Movement Tracking**: Log pallets moving in/out of building
- **Trailer Tracking**: Log trailer arrivals/departures at docks
- **Dashboard**: Next.js web interface for viewing counts, logs, and snapshots
- **Automated Reporting**: Scheduled email reports with Excel/CSV exports

### Tech Stack
- **Backend**: Python service (NVR connection, AI/CV processing, database, reporting)
- **Frontend**: Next.js web application
- **Cameras**: Existing Hikvision/Dahua NVR system (RTSP/ONVIF)
- **Database**: Local SQL database (PostgreSQL/SQLite) for event storage
- **Storage**: Local filesystem for snapshot images
- **Email**: SMTP for automated reports
- **Deployment**: Docker Compose (all services containerized)

## Architecture

### Deployment Strategy: Fully On-Premise (Docker)

**Why Docker:**
- Easy deployment on any PC/server on local network
- Consistent environment (dev → production)
- All services in one stack (backend, frontend, database)
- Isolated from host system
- Easy to backup/restore with Docker volumes

**Network Requirements:**
- **CRITICAL**: Backend analyzer MUST be on same local network as NVR
- RTSP streams require local network access (high bandwidth, low latency)
- NVR should NOT be exposed to internet (security)

**Docker Services:**
```
services:
  backend:        # Python AI/CV analyzer
  frontend:       # Next.js dashboard
  database:       # PostgreSQL/MySQL
  redis:          # Optional: caching/job queues
```

**Access:**
- Dashboard accessible via local IP (e.g., http://192.168.1.100:3000)
- Can add VPN or port forwarding for remote access later
- Backend connects directly to NVR on local network

**Considerations:**
- GPU acceleration: May need `nvidia-docker` runtime if using GPU for AI
- Persistent storage: Docker volumes for database, snapshots, logs
- Network mode: `host` or `bridge` with proper port exposure for NVR access

### Data Storage Strategy

**Database (SQL):**
- All event data stored locally in SQL database (PostgreSQL or SQLite)
- Event tables: pallets, trailers, security_alerts
- Indexed by timestamp, location, type for fast queries
- Persistent Docker volume for database files

**Snapshot Images:**
- Camera snapshots saved to local filesystem
- Directory structure: `/snapshots/YYYY/MM/DD/event-id.jpg`
- Referenced by URL in database records
- Persistent Docker volume for image storage
- Retention policy: 30 days (configurable)

**Frontend Data Access:**
- Frontend queries backend API for events
- No mock data in production
- Real-time updates via WebSocket (future enhancement)
- Export functionality creates daily spreadsheets from database data

## Project Guidelines

### Documentation Standards
- All documentation goes in `/docs/` folder
- Keep README.md in project root for overview
- Update this log as project progresses

### Development Standards
- Docker-first development (all services containerized)
- Single `docker-compose.yml` for entire stack
- Environment variables in `.env` file (not committed to git)
- All documentation in `/docs/` folder
- **ALWAYS rebuild Docker on code changes**: `docker-compose up -d --build`

## Project Log

### 2025-11-17

#### Session 1: Project Setup
- Project initialized
- GitHub repository linked: https://github.com/Sultansmooth/Best-Way-Vision
- Documentation structure created
- Project overview documented
- Docker deployment architecture decided (fully on-premise)

#### Session 2: Complete Frontend Application
**Framework & Setup:**
- Next.js 14 initialized with TypeScript and Tailwind CSS
- Project structure organized with `src/` directory
- UI component library created (shadcn/ui style)
- Type definitions for all event types

**Core Pages Built:**
- **Dashboard** (`/`): Statistics cards, recent events, refresh functionality
- **Events Listing** (`/events`): Tabbed interface, search, filters, export
- **Event Detail** (`/events/[id]`): Full event info, images, type-specific details
- **Admin Settings** (`/admin`): Email config, SMTP settings, report scheduling

**Features Implemented:**
- Search functionality (full-text across all fields)
- Advanced filtering (date range, location, type, severity)
- CSV export (all events or filtered results)
- Excel export (formatted .xlsx with proper columns)
- Mock data generator (30 days of realistic events)
- Skeleton loading states (no spinners)
- Responsive design (mobile-friendly)

**Event System:**
- Pallet Events: Carton counting, zone tracking
- Trailer Events: Dock activity, OCR name detection
- Security Events: Alerts with severity levels

**Technical Highlights:**
- Full TypeScript type safety
- API abstraction layer ready for backend
- localStorage persistence (mock data)
- Professional UI with hover effects
- Color-coded event types
- Export utilities (CSV + Excel)

**Documentation:**
- `/docs/FRONTEND-ARCHITECTURE.md` - Complete architecture
- `/docs/FRONTEND-COMPLETE.md` - Feature summary & usage guide

**Status:** Frontend is 100% complete and ready for backend integration.

**Docker Setup:**
- Frontend Dockerized with multi-stage build
- docker-compose.yml created with full stack structure
- Configured for port 3001 (avoiding conflict with dev server on 3000)
- Placeholders for backend, database, redis services
- .dockerignore and .env.example created
- Production-ready Dockerfile with security best practices

**Frontend Enhancements:**
- Updated text colors to darker greys for better readability (text-gray-700/800)
- Changed chart visualization to 7-day trend lines
- Export functionality updated:
  - Primary: "Export Daily Report" - groups events by day with separate sheets
  - Secondary: "Export All" - exports all filtered events
- Removed mock data placeholder - app starts with empty state
- Ready for backend integration

#### Session 3: Camera Feeds & Zone Configuration
**New Feature: Feeds Tab**
- Complete camera feed management system
- User-customizable camera configuration (no pre-programmed data)
- Detection zone drawing and configuration interface

**Camera Management:**
- Add/edit/delete cameras with custom names
- Configure camera details:
  - Camera name (friendly identifier)
  - Camera ID (unique identifier for event logging)
  - Location (physical location)
  - RTSP URL (connection to NVR/camera)
  - Resolution and FPS settings
  - Status tracking (online/offline/error)
- Empty state prompts users to add first camera
- Filter cameras by location and status
- Edit camera settings via settings button on each card

**Zone Configuration:**
- Interactive canvas-based zone drawing (click to add boundary points)
- Three zone types with type-specific configurations:
  - **Pallet Scan**: Carton counting zones
    - Min/max carton count thresholds
    - Counting direction (in/out)
  - **Trailer Dock**: Trailer detection zones
    - Dock number assignment
    - Direction detection toggle
    - OCR for trailer name recognition
  - **Security**: Alert zones
    - Alert type (unauthorized personnel, suspicious activity, restricted area, after hours)
    - Severity levels (low/medium/high)
    - Schedule-based activation (active hours)
- Zone overlay visualization on camera feeds
- Color-coded zones by type
- Enable/disable zones without deletion
- Multiple zones per camera supported

**UI/UX Features:**
- Skeleton loading states for camera grid
- Real-time zone overlay rendering on canvas
- Responsive 2-column grid layout
- Hover effects on cards
- Color picker for custom zone colors
- Settings icon for quick camera editing
- Persistent storage via localStorage (ready for backend)

**Branding Updates:**
- Added company logo (public/icon.png) to navbar
- Changed "Best Way Vision" title color from blue to green
- Updated active navigation border to green (brand consistency)

**Technical Implementation:**
- Created comprehensive type system for cameras, zones, and feeds
- Camera management API (create, read, update, delete)
- Zone management API with camera association
- Canvas-based zone drawing with percentage-based coordinates
- Modal-based configuration interfaces
- Data persistence to localStorage (ready for SQL backend)

**Files Created:**
- `/frontend/src/types/feeds.ts` - Type definitions for cameras/zones
- `/frontend/src/lib/feeds-api.ts` - API layer for camera/zone management
- `/frontend/src/components/feeds/camera-feed-card.tsx` - Camera display with zone overlay
- `/frontend/src/components/feeds/camera-config-modal.tsx` - Camera configuration UI
- `/frontend/src/components/feeds/zone-config-modal.tsx` - Zone drawing and configuration UI
- `/frontend/src/app/feeds/page.tsx` - Main feeds page

**Files Modified:**
- `/frontend/src/types/index.ts` - Added feeds type exports
- `/frontend/src/components/layout/navbar.tsx` - Added "Feeds" nav item, logo, green branding

#### Session 4: Authentication System
**Login & Security:**
- Simple authentication system to protect the application
- Login page with username/password validation
- Credentials:
  - Username: `admin`
  - Password: `g42004200`
- Session persistence using localStorage
- Protected routes - all pages require authentication
- Logout functionality in navbar

**Technical Implementation:**
- Created auth context for state management
- Protected route wrapper component with redirect logic
- Client-side layout wrapper for auth provider
- Login page with branded design
- Logout button in navbar
- Loading states during authentication check

**Files Created:**
- `/frontend/src/contexts/auth-context.tsx` - Authentication state management
- `/frontend/src/app/login/page.tsx` - Login page component
- `/frontend/src/components/auth/protected-route.tsx` - Route protection wrapper
- `/frontend/src/components/layout/client-layout.tsx` - Client-side layout with auth

**Files Modified:**
- `/frontend/src/app/layout.tsx` - Integrated ClientLayout wrapper
- `/frontend/src/components/layout/navbar.tsx` - Added logout button

**Security Notes:**
- Authentication is client-side only (for demo purposes)
- Ready to be replaced with proper backend authentication
- Session stored in localStorage
- All routes protected except /login

#### Session 5: Data Persistence Verification
**Complete localStorage Implementation:**
- All user-configurable data persists across sessions
- 5 localStorage keys for different data types
- Comprehensive CRUD operations with automatic saving

**Persisted Data:**
1. **Authentication** (`bw-vision-auth`):
   - Login session state
   - Survives page refresh and browser restart

2. **Cameras** (`bw-vision-cameras`):
   - Camera configurations (name, ID, location, RTSP URL, resolution, FPS, status)
   - Create, update, delete all save automatically
   - Linked deletion: Deleting camera removes all its zones

3. **Zones** (`bw-vision-zones`):
   - Detection zones with drawn boundaries
   - Type-specific configurations (pallet scan, trailer dock, security)
   - Color, enabled status, coordinates persist
   - All CRUD operations save to localStorage

4. **Events** (`bw-vision-events`):
   - Event history (currently empty by design)
   - Ready for backend-generated events

5. **Email Configuration** (`bw-vision-email-config`):
   - SMTP settings
   - Recipients, schedule, report time
   - Saved on configuration update

**Testing & Verification:**
- Created comprehensive test document: `/docs/PERSISTENCE-VERIFICATION.md`
- All data survives page refresh, browser restart, navigation
- Ready for backend migration (centralized in api.ts and feeds-api.ts)

**Technical Implementation:**
- Type-safe localStorage operations with error handling
- Automatic save on all CRUD operations
- Date objects properly serialized/deserialized
- Browser compatibility checks (`typeof window !== 'undefined'`)

**Files Created:**
- `/docs/PERSISTENCE-VERIFICATION.md` - Complete testing guide

#### Session 6: Weekly Reports & PDF Export
**New Feature: Reports Tab**
- Complete weekly reporting system with spreadsheet view
- PDF export functionality with branded documents
- Monday-Sunday week tracking

**Report Features:**
- Weekly summary cards showing totals:
  - Total Events
  - Pallet Scans
  - Trailer Activity
  - Security Alerts
- Daily breakdown table:
  - Day of week and date columns
  - Event counts by type for each day
  - Color-coded badges matching event types
  - Weekly totals row in bold
- Empty state when no events exist
- Professional spreadsheet-style layout

**PDF Export:**
- Branded header with Best Way Vision logo (green color)
- Week date range in report title
- Summary table with weekly totals
- Daily breakdown table with all metrics
- Auto-generated timestamp in footer
- Filename format: `weekly-report-YYYY-MM-DD.pdf`

**Technical Implementation:**
- PDF Generation: jsPDF + jspdf-autotable libraries
- Report Logic: Groups events by day (Monday-Sunday)
- Weekly calculations: Automatic totals and daily summaries
- Date handling: Proper week start/end calculation
- Empty state handling: Graceful display when no data

**Files Created:**
- `/frontend/src/lib/weekly-report.ts` - Report generation and PDF export logic
- `/frontend/src/app/reports/page.tsx` - Reports page with spreadsheet UI

**Files Modified:**
- `/frontend/src/components/layout/navbar.tsx` - Added Reports navigation item
- `/frontend/package.json` - Added jspdf and jspdf-autotable dependencies

**UI/UX:**
- Consistent layout with other pages (centered, max-width container)
- Skeleton loading states for data fetching
- Disabled export button when no data available
- Responsive design with proper spacing
- Color-coded event type badges for visual clarity

**Next Steps:**
1. ✅ Test frontend locally (`npm run dev` on port 3000)
2. ✅ Docker setup complete (run on port 3001)
3. ✅ Camera feeds and zone configuration complete
4. ✅ Authentication system implemented
5. ✅ Data persistence verified and documented
6. ✅ Weekly reports and PDF export implemented
7. 🚧 Begin Python backend development
8. 🚧 Set up local SQL database (PostgreSQL/SQLite)
9. 🚧 Implement snapshot image storage system
10. 🚧 Connect frontend to real backend API (replace localStorage with fetch)
11. 🚧 Implement RTSP stream processing
12. 🚧 Integrate AI/CV models for detection
13. 🚧 Replace client-side auth with proper backend authentication
