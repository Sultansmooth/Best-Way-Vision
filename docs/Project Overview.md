Project Overview (High Level)

We’re going to use the existing NVR and security cameras to automatically track pallets and trailers using AI.

The NVR will provide video feeds from the Hikvision/Dahua cameras.

A Python backend service will connect to the NVR, analyze those video feeds with image recognition, and:

Count how many cartons are on each pallet in a defined “scan zone”

Log pallets moving in and out of the building

Log trailer arrivals and departures at the docks

A Next.js web front-end will provide a simple dashboard where you can:

View counts and logs

Review snapshots of pallets/trailers

Download or export the data to Excel/CSV

On a schedule (for example, daily), the system will email a spreadsheet with the pallet and trailer logs to you and Dave.

What’s Required to Set It Up
1. Camera / NVR Side

Existing NVR with network access on the local LAN.

Ability to access NVR streams via RTSP/ONVIF (we’ll need:

NVR IP address

RTSP URLs or channel numbers

Username and password with viewing rights)

Confirm which cameras will be used for:

Pallet carton counting (indoor scan zone)

Pallet in/out tracking (doorway cameras)

Trailer tracking (exterior dock cameras)

2. Server / Backend

A small server or PC on the same network as the NVR to run the Python backend.

Python service will:

Connect to NVR channels

Run AI models on sampled frames

Generate and store log entries in a database

Produce daily/weekly reports (CSV/Excel)

Send emails (SMTP account or company email relay required)

3. Front-End Web App (Next.js)

The Next.js app will be hosted either:

On the same server (internal-only access), or

In the cloud/VPS with secure access back to the backend API.

It will talk to the Python backend through a REST API or WebSocket API to:

Display real-time counts

Show recent events and images

Allow report downloads and basic filters (date range, door, camera, etc.)

4. Configuration / One-Time Setup

Define the zones in each video (e.g. “scan zone” for carton counting, threshold line for in/out).

Set up user accounts for accessing the dashboard (Next.js app).

Configure email recipients and schedule for reports.

Simple testing/validation phase to compare AI counts with manual counts and tune the detection if needed.