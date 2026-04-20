
✉  PenPal
Rediscover the Art of Letter Writing
PRODUCT SPECIFICATION DOCUMENT

Project Name	Khitab— Digital Pen Pal Platform
Version	1.0 (Initial Specification)
Development Stack	React + Spring Boot + Firebase
Development Partner	Antigravity
Maps Provider	Leaflet.js + OpenStreetMap (Free)
Document Date	April 17, 2026
Prepared By	Product & Architecture Team
Status	Draft — For Internal Review
 
1. Executive Summary
Vision, Goals & Product Philosophy

Khitab is a full-stack web application that revives the timeless tradition of pen-pal letter writing within a modern digital experience. The platform introduces an authentic time-delay delivery engine that simulates realistic postal transit times based on the physical distance between correspondents, creating genuine anticipation and emotional weight with every letter sent.

Unlike instant messaging, PenPal deliberately introduces friction through its signature Delivery Engine — letters travel virtually across maps, taking hours or days to arrive, just like real post. This design philosophy is central to the product's identity.

1.1  Core Design Philosophy
Slow Communication	Letters take time to arrive. Distance and delivery class determine wait times.
Authentic Discovery	Find pen pals by interests, country, language, and personality using AI matching.
Visual Journey	Watch your letter travel on a live map with animated postal routes.
Emotional Investment	Notifications like a real letterbox — you receive mail, you don't just see messages.
Privacy First	No social graph. No feeds. No follower counts. Only meaningful correspondence.

1.2  Target Users
•	Adults aged 18–45 seeking meaningful, slow digital connection
•	Language learners wanting authentic international conversation partners
•	Writers, creatives, and journal enthusiasts
•	Educators facilitating international classroom exchanges
•	Anyone nostalgic for the ritual of physical letter writing
 
2. Technology Stack
Full Architecture Specification

2.1  Frontend — React
Framework	React 18 with Vite — fast builds, HMR, ESM-native
Routing	React Router v6 — nested routes, protected route guards
State Management	Redux Toolkit + React Query for server-state and caching
UI Component Library	shadcn/ui + Tailwind CSS — accessible, customizable components
Animation	Framer Motion — letter open/close, envelope animations, map transitions
Map Library	Leaflet.js + React-Leaflet with OpenStreetMap tiles (free, no API key)
Internationalization	i18next — multi-language UI support
Form Handling	React Hook Form + Zod validation
Build / Lint	Vite, ESLint, Prettier, Husky pre-commit hooks
Testing	Vitest + React Testing Library + Playwright (E2E)

2.2  Backend — Spring Boot
Framework	Spring Boot 3.x — Java 21 LTS baseline
Security	Spring Security + Firebase Admin SDK for JWT token verification
REST API	Spring Web MVC — RESTful endpoints with OpenAPI / Swagger docs
Scheduling	Spring Scheduler (@Scheduled) — delivery engine cron jobs every 5 minutes
WebSockets	Spring WebSocket + STOMP — real-time letter status updates and notifications
Firebase Admin SDK	Server-side Firestore reads/writes, Auth token verification, FCM push
Geolocation	GeoTools or geocalc — lat/long distance calculation (Haversine formula)
Caching	Spring Cache + Redis — delivery queue and session caching
Validation	Jakarta Bean Validation (Hibernate Validator)
Logging	SLF4J + Logback — structured JSON logs
Testing	JUnit 5 + Mockito + Testcontainers
Build	Maven 3.9 / Gradle 8 — Docker multi-stage builds

2.3  Firebase Services
Firestore	NoSQL document DB — letters, users, conversations, notifications
Firebase Auth	Email/password, Google OAuth, anonymous sign-in
Firebase Storage	Attachments — photos, drawings, stickers — up to 10 MB per letter
Cloud Messaging (FCM)	Push notifications for letter arrival, new match, system alerts
Firebase Hosting	React SPA static hosting with CDN
Firebase Functions	Lightweight serverless triggers (e.g., new user welcome letter)

2.4  Maps — Free Tier (OpenStreetMap + Leaflet)
Leaflet.js	Open-source interactive map library — no API key required
OpenStreetMap	Free tile server — raster map tiles, globally available
Nominatim	OSM geocoding API — free for non-commercial use (address to lat/long)
Animated Routes	Custom Leaflet polyline animation showing letter transit path
Location Pins	Custom SVG markers for sender/recipient, animated envelope icon in transit
No Cost	All map services are 100% free with no usage limits for reasonable traffic

2.5  Infrastructure & DevOps
Backend Hosting	Google Cloud Run (containerized, auto-scaling) or Railway.app
CI/CD	GitHub Actions — build, test, deploy pipeline
Containerization	Docker + Docker Compose for local development
Environment Config	Spring profiles (dev / staging / prod) + Firebase project per env
Monitoring	Google Cloud Monitoring + Firebase Crashlytics
Secret Management	Google Cloud Secret Manager or Railway environment variables
 
3. Time Delay Delivery Engine
The Heart of PenPal — Simulating Real Postal Transit

The Delivery Engine is PenPal's most distinctive feature. When a user sends a letter, the system does not deliver it instantly. Instead, it calculates a realistic delivery window based on geographic distance, delivery class selected, and optional randomization to simulate real-world postal variability.

3.1  Delivery Time Calculation
Step 1	Capture sender and recipient lat/long coordinates from their profiles.
Step 2	Calculate great-circle distance using the Haversine formula (km).
Step 3	Determine continent zone: Same City / National / Continental / Intercontinental.
Step 4	Apply base delivery time from the zone matrix (see below).
Step 5	Multiply by delivery class modifier (Standard / Express / Airmail / Slow Boat).
Step 6	Add ±20% random jitter to simulate real postal unpredictability.
Step 7	Store scheduled_delivery_at timestamp in Firestore.
Step 8	Spring Scheduler polls every 5 min; delivers when timestamp is reached.

3.2  Zone Distance Matrix
Distance Zone	Base Delivery Window
Same City (< 50 km)	30 minutes — 2 hours
Same Region (50–500 km)	2 – 8 hours
National (500–2,000 km)	6 – 24 hours
Continental (2,000–7,000 km)	1 – 3 days
Intercontinental (> 7,000 km)	3 – 7 days

3.3  Delivery Classes
Class	Multiplier & Notes
Standard Post	1.0x — Default. Realistic postal timing.
Airmail	0.5x — Faster. Premium option. Slight UI cost (postage stamp visual).
Express Courier	0.25x — Much faster. Limited uses per month.
Slow Boat	3.0x — Deliberately very slow. Special badge, romantic/nostalgic mode.
Certified Post	1.0x + read receipt. Sender gets notified when letter is opened.

3.4  Engine Architecture (Spring Boot)
DeliveryScheduler.java — @Scheduled(fixedDelay = 300000)
A Spring-managed cron job runs every 5 minutes. It queries Firestore for all letters where status = IN_TRANSIT and scheduled_delivery_at <= now(). For each eligible letter, it updates Firestore status to DELIVERED, triggers an FCM push notification to the recipient via Firebase Admin SDK, and fires a WebSocket event so the recipient's open browser session shows a live "You've got mail!" toast. The scheduler is idempotent — it uses atomic Firestore transactions to prevent double-delivery.

DeliveryService.java — Business Logic
When a letter is composed and submitted, DeliveryService calculates the distance (Haversine), selects the zone bucket, applies the delivery class multiplier, adds jitter, then computes the final scheduled_delivery_at timestamp. It creates a Firestore document with status = QUEUED, transitions it to IN_TRANSIT after 30 seconds (simulating the letter being "sent"), then the scheduler handles final delivery.

Live Map Tracking
A separate tracking collection in Firestore stores intermediate lat/long waypoints (origin → destination) computed at send-time. A Firestore real-time listener on the frontend animates an envelope icon moving along the route on the Leaflet map as time passes. Progress = elapsed_time / total_delivery_duration.
 
4. Screen Specifications
Complete UI/UX Screen Inventory

4.1  Authentication Screens

Splash / Landing Screen  /
First impression for unauthenticated users. Animates a floating envelope traveling across a world map. Contains the product tagline, CTA buttons, and a short product explainer.
•	Hero: Animated envelope flying across Leaflet world map
•	Tagline: 'Write. Wait. Wonder.' with typewriter animation
•	CTA: 'Start Writing' and 'Log In' buttons
•	Preview: Scrolling section showing sample letter card UI
•	Footer: About, Privacy Policy, Terms of Service

Sign Up Screen  /signup
Multi-step registration wizard that builds the user's pen pal profile. Firebase Auth handles credential creation; Spring Boot creates the extended profile in Firestore.
•	Step 1 — Credentials: Email, password, confirm password (Firebase Auth)
•	Step 2 — Identity: Display name (pen name allowed), country, city
•	Step 3 — About Me: Short bio (250 chars), languages spoken, hobbies (tag selector)
•	Step 4 — Preferences: Age range of pen pals, preferred letter frequency, topics of interest
•	Step 5 — Avatar: Upload profile photo or choose illustrated avatar
•	Google OAuth one-click signup (skips steps 1–2, merges into step 3)
•	Progress indicator across all steps
•	Validation: real-time Zod schema, inline field errors

Login Screen  /login
Standard login with Firebase Auth. Supports email/password and Google OAuth.
•	Email + password fields with show/hide toggle
•	Google Sign-In OAuth button
•	'Forgot Password' link — triggers Firebase password reset email
•	Link to Sign Up page
•	Remember Me toggle
•	Error states: wrong password, account not found, network error

Email Verification Screen  /verify-email
Intermediate screen shown after signup, prompting user to verify their email before accessing the app.
•	Animated envelope illustration
•	Resend verification email button (rate-limited: once per 60 seconds)
•	Auto-redirect to Dashboard when Firebase confirms verification
•	Link to contact support

4.2  Main Application Screens

Main Dashboard / Mailbox  /dashboard
The central hub of the app — the user's personal mailbox. Split into Inbox, Sent, and In Transit panels. Real-time Firestore listeners update the UI without refresh.
•	Inbox tab: Received letters with read/unread status, sender avatar, preview snippet
•	Sent tab: Letters sent with delivery status badge (Queued / In Transit / Delivered / Read)
•	In Transit tab: Live animated mini-map showing letters currently en route (both sent and incoming)
•	Letter cards: Paper texture aesthetic, envelope-open animation on click
•	Unread count badge on app navigation icon
•	Empty state: Illustrated mailbox with CTA to explore or write first letter
•	Quick Compose FAB (floating action button) — bottom right
•	Notification bell with dropdown: arrival alerts, new suggestions, system messages

Compose Letter Screen  /compose
The letter writing experience — the most important UX in the app. Designed to feel like sitting at a writing desk.
•	Recipient search bar (type name or browse suggestions)
•	Stationery selector: 8+ paper styles (lined, blank, vintage, seasonal)
•	Rich text editor: bold, italic, underline, paragraph styles — no markdown, WYSIWYG
•	Attachment panel: photos, drawings (canvas tool), stickers, washi tape decorations
•	Delivery class selector with estimated delivery time preview
•	Live Delivery Preview: mini-map showing sender and recipient pins, estimated route
•	Stamp selector: decorative postage stamps for the envelope
•	Word count / character count indicator
•	Auto-save drafts every 30 seconds to Firestore
•	Send button: triggers envelope-seal animation, then zooms into the map to show letter departing

Letter Detail / Reading Screen  /letter/:letterId
Full-screen letter reading experience with paper unfolding animation.
•	Animated envelope opening on first view
•	Letter renders on chosen stationery with sender's handwriting-style font option
•	Attached photos displayed inline in a lightbox gallery
•	Reply button: opens Compose with recipient pre-filled
•	Report / Block button (discreet footer)
•	Letter metadata: sent date, received date, delivery time taken, distance traveled
•	Share quote: extract a sentence to share as an aesthetic graphic (opt-in)
•	Delete letter (with confirmation modal)

Live Map Tracking Screen  /track/:letterId
Full-page interactive Leaflet map showing a specific letter's journey in real time.
•	Full-viewport Leaflet map (OpenStreetMap tiles, dark or light theme)
•	Animated envelope icon moves along the route arc proportional to elapsed delivery time
•	Origin pin (sender city) and destination pin (recipient city) with custom SVG markers
•	Info panel: letter title, delivery class, sent at, ETA, distance in km
•	Route drawn as animated dashed polyline with easing
•	Milestone markers: 25%, 50%, 75% waypoints with micro-animations
•	Shareable link to show the live route to others
•	Confetti animation + sound effect when letter arrives

4.3  Explore & Discovery Screens

Explore Screen  /explore
Browse the global PenPal community. Filter pen pals by location, interests, language, and more.
•	Interactive world map (Leaflet): country bubbles sized by active pen pal count
•	Click country: zoom in, show user cards from that country
•	Filter sidebar: Language, Age Range, Interests (tags), Frequency preference, Online recently
•	User cards: avatar, pen name, country flag, language badges, 1-line bio, 'Write to Them' CTA
•	Search bar: find by pen name or location
•	Grid / List view toggle
•	Pagination / infinite scroll
•	Exclude users already corresponding with

Suggestions Screen  /suggestions
AI-powered pen pal matching screen. The backend scores users by compatibility across multiple dimensions.
•	Daily match refresh (new suggestions every 24 hours)
•	Match cards showing compatibility score (out of 100) with breakdown by category
•	Compatibility dimensions: Shared interests, Language match, Similar activity level, Complementary locations, Letter frequency alignment
•	Accept / Pass / Save for Later actions on each card
•	Accepted match: goes to Chat Request state (see below)
•	'Why we matched you' expandable tooltip
•	Weekly 'Featured Pen Pal' — handpicked editorial spotlight
•	Empty state after swiping all: humorous waiting illustration with refresh countdown

User Profile Screen  /profile/:userId
View another user's public profile before writing to them.
•	Avatar, pen name, country, city (approximate), member since
•	Languages spoken (with proficiency badges)
•	Interest tags, short bio
•	Response rate and average reply time (e.g., 'Usually replies within 2 days')
•	Letter samples: opt-in public excerpts from their letters (anonymized)
•	Write a Letter CTA button
•	Report / Block options
•	Location shown on mini Leaflet map (city-level, not precise)

4.4  Settings & Account Screens

My Profile / Edit Profile  /settings/profile
Manage the user's pen pal identity and preferences.
•	Edit pen name, avatar, bio, location, languages, interests
•	Pen pal preferences: age range, letter frequency, reply expectations
•	Visibility settings: who can find you (everyone / suggestions only / invite only)
•	Profile preview mode: see how your profile looks to others

Notification Settings  /settings/notifications
Granular control over all notification types.
•	Letter arrived — Push, Email, In-App
•	Letter read by recipient — Push, In-App
•	New pen pal suggestion — Weekly digest email, In-App
•	Pen pal request accepted — Push, Email
•	System announcements — Email only
•	Quiet hours: set a do-not-disturb time window

Subscription & Postage Screen  /settings/subscription
Freemium model — manage plan and postage credits.
•	Free Plan: 3 active pen pals, Standard delivery only, no attachments
•	Pen Pal Plus ($3.99/mo): Unlimited pen pals, Airmail + Express, photo attachments
•	Pen Pal Pro ($7.99/mo): All Plus features + drawing canvas, sticker packs, Slow Boat mode, priority matching
•	Postage Credit system: buy extra Express credits a la carte
•	Billing history table
•	Cancel subscription flow with feedback form

Archive Screen  /archive
Long-term storage for completed or old correspondences.
•	Archived conversations grouped by pen pal
•	Full letter thread view (chronological timeline)
•	Search within archive by keyword or date range
•	Export conversation as PDF keepsake
•	Restore from archive option
•	Letter count and time-span summary per thread

Pen Pal Request Screen  /requests
Manage incoming and outgoing correspondence requests before the first letter is sent.
•	Incoming requests: pen pal wants to write to you — Accept / Decline
•	Outgoing pending: requests you've sent waiting for response
•	Accepted: start writing now CTA
•	Request includes: sender profile preview, a short intro message (required on request)
•	Auto-expire: requests that aren't accepted in 7 days are withdrawn

Help & FAQ Screen  /help
In-app support and onboarding resources.
•	Searchable FAQ accordion
•	Guided product tour launcher (interactive overlay tour of key features)
•	Contact support form — sends to support email via Spring Boot email service
•	Community guidelines and safety tips
•	Feedback / Feature request form
 
5. Backend API Design
Spring Boot REST Endpoint Overview

5.1  Auth Endpoints
Endpoint	Description
POST /api/auth/register	Create extended user profile in Firestore after Firebase Auth signup
POST /api/auth/verify-token	Validate Firebase JWT and return session info
POST /api/auth/update-profile	Update bio, interests, location, preferences

5.2  Letter Endpoints
Endpoint	Description
POST /api/letters/send	Create letter, calculate delivery time, enqueue in Firestore
GET /api/letters/inbox	Paginated inbox for authenticated user
GET /api/letters/sent	Paginated sent letters
GET /api/letters/in-transit	All letters currently in transit (sent or incoming)
GET /api/letters/:id	Full letter content (auth required, only participants)
GET /api/letters/:id/track	Real-time tracking data (progress, waypoints, ETA)
DELETE /api/letters/:id	Soft-delete letter (moved to archive)
POST /api/letters/:id/report	Report letter for review

5.3  Matching & Discovery Endpoints
Endpoint	Description
GET /api/match/suggestions	Get daily pen pal suggestions ranked by compatibility score
POST /api/match/accept/:userId	Accept a suggestion — creates Pen Pal Request
POST /api/match/pass/:userId	Pass on suggestion — excluded from future suggestions
GET /api/explore/users	Browse users with filters (country, language, interests)
GET /api/explore/map-data	Country-level user density for Explore map bubbles

5.4  Delivery Engine Endpoints
Endpoint	Description
GET /api/delivery/estimate	Calculate estimated delivery time for a given sender/recipient pair + class
GET /api/delivery/classes	List available delivery classes and their multipliers
POST /api/delivery/admin/trigger	Admin only — manually trigger delivery check (dev/testing)

5.5  Notifications
Endpoint	Description
GET /api/notifications	Get paginated notification list for user
POST /api/notifications/mark-read/:id	Mark notification read
POST /api/notifications/mark-all-read	Mark all notifications read
WS /ws/notifications	WebSocket endpoint — real-time notification stream (STOMP)
WS /ws/letter-status/:id	WebSocket — live letter status for in-transit tracking
 
6. Firestore Data Model
NoSQL Document Structure

6.1  Collections Overview
Collection	Purpose
users/{userId}	Profile, preferences, lat/long, stats, subscription tier
letters/{letterId}	Letter content, metadata, status, delivery timeline, attachments
threads/{threadId}	Pen pal correspondence thread — array of letter IDs, participant UIDs
requests/{requestId}	Pen pal requests — sender, recipient, intro message, status
notifications/{notifId}	Notification events — type, userId, payload, read flag
tracking/{letterId}	Delivery tracking — waypoints array, progress, ETA, status timestamps
reports/{reportId}	User/letter reports for moderation
delivery_queue/{letterId}	Scheduler queue — letters awaiting delivery, scheduled_delivery_at

6.2  Letter Document Schema
letters/{letterId} — Key Fields
letterId (string), senderId, recipientId, threadId, subject, body (HTML), stationeryId, stampId, deliveryClass, status [DRAFT|QUEUED|IN_TRANSIT|DELIVERED|READ|ARCHIVED], attachments[] (Storage URLs), created_at, sent_at, scheduled_delivery_at, delivered_at, read_at, distance_km, delivery_duration_ms, sender_location {lat, lng, city, country}, recipient_location {lat, lng, city, country}, reported (bool), deleted_at

6.3  Security Rules (Firestore)
Access Control Principles
Users can only read/write their own profile. Letters: only sender and recipient may read. Only sender may create; no edits after sent_at is set. Tracking: readable by sender and recipient. Requests: sender can create; recipient can update status. Notifications: only the target user may read. Admin SDK (Spring Boot) bypasses rules for the delivery scheduler.
 
7. Pen Pal Matching Algorithm
Compatibility Scoring System

The matching engine runs server-side in Spring Boot as a nightly batch job and on-demand when a user refreshes their suggestions. It scores every eligible user pairing and stores the top 20 matches per user in Firestore for fast retrieval.

7.1  Scoring Dimensions
Dimension	Max Score	Notes
Shared Interests	30 pts
Language Compatibility	25 pts
Letter Frequency Match	15 pts
Location Diversity Score	15 pts
Activity Recency	10 pts
Age Range Overlap	5 pts

7.2  Exclusion Rules
•	Already corresponding (active thread exists)
•	Previously passed / blocked
•	User set to 'invite only' visibility
•	Age range preferences don't mutually overlap
•	User account less than 24 hours old (prevents spam)
 
8. Development Roadmap
Phased Delivery Plan — Antigravity

Phase	Key Deliverables
Phase 1 — Foundation (Weeks 1–4)	Project scaffold, Firebase setup, Spring Boot skeleton, Auth screens (Login/Signup/Verify), Firestore schema, CI/CD pipeline
Phase 2 — Core Loop (Weeks 5–8)	Compose screen, Letter Firestore model, Delivery Engine v1 (scheduler + calculation), Dashboard/Inbox/Sent screens, Letter Detail screen
Phase 3 — Maps & Tracking (Weeks 9–11)	Leaflet integration, Live Tracking screen, Explore map with country bubbles, animated envelope transit
Phase 4 — Discovery (Weeks 12–14)	Matching algorithm, Suggestions screen, Pen Pal Request flow, User Profile screen, Explore filters
Phase 5 — Polish & Notifications (Weeks 15–17)	FCM push notifications, WebSocket real-time updates, Notification Settings, Archive, stationery & stamp picker
Phase 6 — Monetization & Launch (Weeks 18–20)	Subscription screen, Stripe integration, Freemium gating, onboarding tour, Help/FAQ, beta testing, production launch
 
9. Non-Functional Requirements
Performance, Security & Quality

Requirement	Target
Performance	API P95 response < 300ms; Firestore reads < 100ms; Map tiles load < 2s
Scalability	Cloud Run auto-scales to 0; Firestore horizontally scalable by default
Security	Firebase JWT on all API calls; HTTPS everywhere; no PII logged; GDPR-ready
Availability	99.5% uptime SLA; delivery scheduler has retry logic with exponential backoff
Accessibility	WCAG 2.1 AA; keyboard navigable; screen reader tested with NVDA/VoiceOver
Mobile Responsive	Full mobile-first responsive design; PWA-ready (offline draft saving)
Internationalisation	i18next; RTL layout support; date/time formatted by user locale
Delivery Reliability	Delivery scheduler is idempotent; uses Firestore transactions; no double-delivery
 
10. Glossary
Key Terms & Definitions

Term	Definition
Delivery Engine	Spring Boot subsystem that calculates and enforces simulated letter delivery delays
Jitter	±20% random variation added to delivery time to simulate real postal unpredictability
Haversine Formula	Mathematical formula to calculate great-circle distance between two lat/long points
IN_TRANSIT	Firestore letter status: sent but not yet delivered to recipient
Stationery	Visual paper style applied to a letter (texture, colour, ruling, borders)
Thread	A bi-directional correspondence chain between two users, containing all their letters
Postage Credit	In-app currency for purchasing Express delivery sends
FCM	Firebase Cloud Messaging — used to send push notifications to users' devices
STOMP	Streaming Text Oriented Messaging Protocol — used for WebSocket messaging in Spring
Antigravity	The development agency building and delivering the PenPal platform

— End of Document —
Khitab ·  Antigravity  ·  Confidential v1.0

✉  PenPal
Rediscover the Art of Letter Writing
PRODUCT SPECIFICATION DOCUMENT

Project Name	Khitab— Digital Pen Pal Platform
Version	1.0 (Initial Specification)
Development Stack	React + Spring Boot + Firebase
Development Partner	Antigravity
Maps Provider	Leaflet.js + OpenStreetMap (Free)
Document Date	April 17, 2026
Prepared By	Product & Architecture Team
Status	Draft — For Internal Review
 
1. Executive Summary
Vision, Goals & Product Philosophy

Khitab is a full-stack web application that revives the timeless tradition of pen-pal letter writing within a modern digital experience. The platform introduces an authentic time-delay delivery engine that simulates realistic postal transit times based on the physical distance between correspondents, creating genuine anticipation and emotional weight with every letter sent.

Unlike instant messaging, PenPal deliberately introduces friction through its signature Delivery Engine — letters travel virtually across maps, taking hours or days to arrive, just like real post. This design philosophy is central to the product's identity.

1.1  Core Design Philosophy
Slow Communication	Letters take time to arrive. Distance and delivery class determine wait times.
Authentic Discovery	Find pen pals by interests, country, language, and personality using AI matching.
Visual Journey	Watch your letter travel on a live map with animated postal routes.
Emotional Investment	Notifications like a real letterbox — you receive mail, you don't just see messages.
Privacy First	No social graph. No feeds. No follower counts. Only meaningful correspondence.

1.2  Target Users
•	Adults aged 18–45 seeking meaningful, slow digital connection
•	Language learners wanting authentic international conversation partners
•	Writers, creatives, and journal enthusiasts
•	Educators facilitating international classroom exchanges
•	Anyone nostalgic for the ritual of physical letter writing
 
2. Technology Stack
Full Architecture Specification

2.1  Frontend — React
Framework	React 18 with Vite — fast builds, HMR, ESM-native
Routing	React Router v6 — nested routes, protected route guards
State Management	Redux Toolkit + React Query for server-state and caching
UI Component Library	shadcn/ui + Tailwind CSS — accessible, customizable components
Animation	Framer Motion — letter open/close, envelope animations, map transitions
Map Library	Leaflet.js + React-Leaflet with OpenStreetMap tiles (free, no API key)
Internationalization	i18next — multi-language UI support
Form Handling	React Hook Form + Zod validation
Build / Lint	Vite, ESLint, Prettier, Husky pre-commit hooks
Testing	Vitest + React Testing Library + Playwright (E2E)

2.2  Backend — Spring Boot
Framework	Spring Boot 3.x — Java 21 LTS baseline
Security	Spring Security + Firebase Admin SDK for JWT token verification
REST API	Spring Web MVC — RESTful endpoints with OpenAPI / Swagger docs
Scheduling	Spring Scheduler (@Scheduled) — delivery engine cron jobs every 5 minutes
WebSockets	Spring WebSocket + STOMP — real-time letter status updates and notifications
Firebase Admin SDK	Server-side Firestore reads/writes, Auth token verification, FCM push
Geolocation	GeoTools or geocalc — lat/long distance calculation (Haversine formula)
Caching	Spring Cache + Redis — delivery queue and session caching
Validation	Jakarta Bean Validation (Hibernate Validator)
Logging	SLF4J + Logback — structured JSON logs
Testing	JUnit 5 + Mockito + Testcontainers
Build	Maven 3.9 / Gradle 8 — Docker multi-stage builds

2.3  Firebase Services
Firestore	NoSQL document DB — letters, users, conversations, notifications
Firebase Auth	Email/password, Google OAuth, anonymous sign-in
Firebase Storage	Attachments — photos, drawings, stickers — up to 10 MB per letter
Cloud Messaging (FCM)	Push notifications for letter arrival, new match, system alerts
Firebase Hosting	React SPA static hosting with CDN
Firebase Functions	Lightweight serverless triggers (e.g., new user welcome letter)

2.4  Maps — Free Tier (OpenStreetMap + Leaflet)
Leaflet.js	Open-source interactive map library — no API key required
OpenStreetMap	Free tile server — raster map tiles, globally available
Nominatim	OSM geocoding API — free for non-commercial use (address to lat/long)
Animated Routes	Custom Leaflet polyline animation showing letter transit path
Location Pins	Custom SVG markers for sender/recipient, animated envelope icon in transit
No Cost	All map services are 100% free with no usage limits for reasonable traffic

2.5  Infrastructure & DevOps
Backend Hosting	Google Cloud Run (containerized, auto-scaling) or Railway.app
CI/CD	GitHub Actions — build, test, deploy pipeline
Containerization	Docker + Docker Compose for local development
Environment Config	Spring profiles (dev / staging / prod) + Firebase project per env
Monitoring	Google Cloud Monitoring + Firebase Crashlytics
Secret Management	Google Cloud Secret Manager or Railway environment variables
 
3. Time Delay Delivery Engine
The Heart of PenPal — Simulating Real Postal Transit

The Delivery Engine is PenPal's most distinctive feature. When a user sends a letter, the system does not deliver it instantly. Instead, it calculates a realistic delivery window based on geographic distance, delivery class selected, and optional randomization to simulate real-world postal variability.

3.1  Delivery Time Calculation
Step 1	Capture sender and recipient lat/long coordinates from their profiles.
Step 2	Calculate great-circle distance using the Haversine formula (km).
Step 3	Determine continent zone: Same City / National / Continental / Intercontinental.
Step 4	Apply base delivery time from the zone matrix (see below).
Step 5	Multiply by delivery class modifier (Standard / Express / Airmail / Slow Boat).
Step 6	Add ±20% random jitter to simulate real postal unpredictability.
Step 7	Store scheduled_delivery_at timestamp in Firestore.
Step 8	Spring Scheduler polls every 5 min; delivers when timestamp is reached.

3.2  Zone Distance Matrix
Distance Zone	Base Delivery Window
Same City (< 50 km)	30 minutes — 2 hours
Same Region (50–500 km)	2 – 8 hours
National (500–2,000 km)	6 – 24 hours
Continental (2,000–7,000 km)	1 – 3 days
Intercontinental (> 7,000 km)	3 – 7 days

3.3  Delivery Classes
Class	Multiplier & Notes
Standard Post	1.0x — Default. Realistic postal timing.
Airmail	0.5x — Faster. Premium option. Slight UI cost (postage stamp visual).
Express Courier	0.25x — Much faster. Limited uses per month.
Slow Boat	3.0x — Deliberately very slow. Special badge, romantic/nostalgic mode.
Certified Post	1.0x + read receipt. Sender gets notified when letter is opened.

3.4  Engine Architecture (Spring Boot)
DeliveryScheduler.java — @Scheduled(fixedDelay = 300000)
A Spring-managed cron job runs every 5 minutes. It queries Firestore for all letters where status = IN_TRANSIT and scheduled_delivery_at <= now(). For each eligible letter, it updates Firestore status to DELIVERED, triggers an FCM push notification to the recipient via Firebase Admin SDK, and fires a WebSocket event so the recipient's open browser session shows a live "You've got mail!" toast. The scheduler is idempotent — it uses atomic Firestore transactions to prevent double-delivery.

DeliveryService.java — Business Logic
When a letter is composed and submitted, DeliveryService calculates the distance (Haversine), selects the zone bucket, applies the delivery class multiplier, adds jitter, then computes the final scheduled_delivery_at timestamp. It creates a Firestore document with status = QUEUED, transitions it to IN_TRANSIT after 30 seconds (simulating the letter being "sent"), then the scheduler handles final delivery.

Live Map Tracking
A separate tracking collection in Firestore stores intermediate lat/long waypoints (origin → destination) computed at send-time. A Firestore real-time listener on the frontend animates an envelope icon moving along the route on the Leaflet map as time passes. Progress = elapsed_time / total_delivery_duration.
 
4. Screen Specifications
Complete UI/UX Screen Inventory

4.1  Authentication Screens

Splash / Landing Screen  /
First impression for unauthenticated users. Animates a floating envelope traveling across a world map. Contains the product tagline, CTA buttons, and a short product explainer.
•	Hero: Animated envelope flying across Leaflet world map
•	Tagline: 'Write. Wait. Wonder.' with typewriter animation
•	CTA: 'Start Writing' and 'Log In' buttons
•	Preview: Scrolling section showing sample letter card UI
•	Footer: About, Privacy Policy, Terms of Service

Sign Up Screen  /signup
Multi-step registration wizard that builds the user's pen pal profile. Firebase Auth handles credential creation; Spring Boot creates the extended profile in Firestore.
•	Step 1 — Credentials: Email, password, confirm password (Firebase Auth)
•	Step 2 — Identity: Display name (pen name allowed), country, city
•	Step 3 — About Me: Short bio (250 chars), languages spoken, hobbies (tag selector)
•	Step 4 — Preferences: Age range of pen pals, preferred letter frequency, topics of interest
•	Step 5 — Avatar: Upload profile photo or choose illustrated avatar
•	Google OAuth one-click signup (skips steps 1–2, merges into step 3)
•	Progress indicator across all steps
•	Validation: real-time Zod schema, inline field errors

Login Screen  /login
Standard login with Firebase Auth. Supports email/password and Google OAuth.
•	Email + password fields with show/hide toggle
•	Google Sign-In OAuth button
•	'Forgot Password' link — triggers Firebase password reset email
•	Link to Sign Up page
•	Remember Me toggle
•	Error states: wrong password, account not found, network error

Email Verification Screen  /verify-email
Intermediate screen shown after signup, prompting user to verify their email before accessing the app.
•	Animated envelope illustration
•	Resend verification email button (rate-limited: once per 60 seconds)
•	Auto-redirect to Dashboard when Firebase confirms verification
•	Link to contact support

4.2  Main Application Screens

Main Dashboard / Mailbox  /dashboard
The central hub of the app — the user's personal mailbox. Split into Inbox, Sent, and In Transit panels. Real-time Firestore listeners update the UI without refresh.
•	Inbox tab: Received letters with read/unread status, sender avatar, preview snippet
•	Sent tab: Letters sent with delivery status badge (Queued / In Transit / Delivered / Read)
•	In Transit tab: Live animated mini-map showing letters currently en route (both sent and incoming)
•	Letter cards: Paper texture aesthetic, envelope-open animation on click
•	Unread count badge on app navigation icon
•	Empty state: Illustrated mailbox with CTA to explore or write first letter
•	Quick Compose FAB (floating action button) — bottom right
•	Notification bell with dropdown: arrival alerts, new suggestions, system messages

Compose Letter Screen  /compose
The letter writing experience — the most important UX in the app. Designed to feel like sitting at a writing desk.
•	Recipient search bar (type name or browse suggestions)
•	Stationery selector: 8+ paper styles (lined, blank, vintage, seasonal)
•	Rich text editor: bold, italic, underline, paragraph styles — no markdown, WYSIWYG
•	Attachment panel: photos, drawings (canvas tool), stickers, washi tape decorations
•	Delivery class selector with estimated delivery time preview
•	Live Delivery Preview: mini-map showing sender and recipient pins, estimated route
•	Stamp selector: decorative postage stamps for the envelope
•	Word count / character count indicator
•	Auto-save drafts every 30 seconds to Firestore
•	Send button: triggers envelope-seal animation, then zooms into the map to show letter departing

Letter Detail / Reading Screen  /letter/:letterId
Full-screen letter reading experience with paper unfolding animation.
•	Animated envelope opening on first view
•	Letter renders on chosen stationery with sender's handwriting-style font option
•	Attached photos displayed inline in a lightbox gallery
•	Reply button: opens Compose with recipient pre-filled
•	Report / Block button (discreet footer)
•	Letter metadata: sent date, received date, delivery time taken, distance traveled
•	Share quote: extract a sentence to share as an aesthetic graphic (opt-in)
•	Delete letter (with confirmation modal)

Live Map Tracking Screen  /track/:letterId
Full-page interactive Leaflet map showing a specific letter's journey in real time.
•	Full-viewport Leaflet map (OpenStreetMap tiles, dark or light theme)
•	Animated envelope icon moves along the route arc proportional to elapsed delivery time
•	Origin pin (sender city) and destination pin (recipient city) with custom SVG markers
•	Info panel: letter title, delivery class, sent at, ETA, distance in km
•	Route drawn as animated dashed polyline with easing
•	Milestone markers: 25%, 50%, 75% waypoints with micro-animations
•	Shareable link to show the live route to others
•	Confetti animation + sound effect when letter arrives

4.3  Explore & Discovery Screens

Explore Screen  /explore
Browse the global PenPal community. Filter pen pals by location, interests, language, and more.
•	Interactive world map (Leaflet): country bubbles sized by active pen pal count
•	Click country: zoom in, show user cards from that country
•	Filter sidebar: Language, Age Range, Interests (tags), Frequency preference, Online recently
•	User cards: avatar, pen name, country flag, language badges, 1-line bio, 'Write to Them' CTA
•	Search bar: find by pen name or location
•	Grid / List view toggle
•	Pagination / infinite scroll
•	Exclude users already corresponding with

Suggestions Screen  /suggestions
AI-powered pen pal matching screen. The backend scores users by compatibility across multiple dimensions.
•	Daily match refresh (new suggestions every 24 hours)
•	Match cards showing compatibility score (out of 100) with breakdown by category
•	Compatibility dimensions: Shared interests, Language match, Similar activity level, Complementary locations, Letter frequency alignment
•	Accept / Pass / Save for Later actions on each card
•	Accepted match: goes to Chat Request state (see below)
•	'Why we matched you' expandable tooltip
•	Weekly 'Featured Pen Pal' — handpicked editorial spotlight
•	Empty state after swiping all: humorous waiting illustration with refresh countdown

User Profile Screen  /profile/:userId
View another user's public profile before writing to them.
•	Avatar, pen name, country, city (approximate), member since
•	Languages spoken (with proficiency badges)
•	Interest tags, short bio
•	Response rate and average reply time (e.g., 'Usually replies within 2 days')
•	Letter samples: opt-in public excerpts from their letters (anonymized)
•	Write a Letter CTA button
•	Report / Block options
•	Location shown on mini Leaflet map (city-level, not precise)

4.4  Settings & Account Screens

My Profile / Edit Profile  /settings/profile
Manage the user's pen pal identity and preferences.
•	Edit pen name, avatar, bio, location, languages, interests
•	Pen pal preferences: age range, letter frequency, reply expectations
•	Visibility settings: who can find you (everyone / suggestions only / invite only)
•	Profile preview mode: see how your profile looks to others

Notification Settings  /settings/notifications
Granular control over all notification types.
•	Letter arrived — Push, Email, In-App
•	Letter read by recipient — Push, In-App
•	New pen pal suggestion — Weekly digest email, In-App
•	Pen pal request accepted — Push, Email
•	System announcements — Email only
•	Quiet hours: set a do-not-disturb time window

Subscription & Postage Screen  /settings/subscription
Freemium model — manage plan and postage credits.
•	Free Plan: 3 active pen pals, Standard delivery only, no attachments
•	Pen Pal Plus ($3.99/mo): Unlimited pen pals, Airmail + Express, photo attachments
•	Pen Pal Pro ($7.99/mo): All Plus features + drawing canvas, sticker packs, Slow Boat mode, priority matching
•	Postage Credit system: buy extra Express credits a la carte
•	Billing history table
•	Cancel subscription flow with feedback form

Archive Screen  /archive
Long-term storage for completed or old correspondences.
•	Archived conversations grouped by pen pal
•	Full letter thread view (chronological timeline)
•	Search within archive by keyword or date range
•	Export conversation as PDF keepsake
•	Restore from archive option
•	Letter count and time-span summary per thread

Pen Pal Request Screen  /requests
Manage incoming and outgoing correspondence requests before the first letter is sent.
•	Incoming requests: pen pal wants to write to you — Accept / Decline
•	Outgoing pending: requests you've sent waiting for response
•	Accepted: start writing now CTA
•	Request includes: sender profile preview, a short intro message (required on request)
•	Auto-expire: requests that aren't accepted in 7 days are withdrawn

Help & FAQ Screen  /help
In-app support and onboarding resources.
•	Searchable FAQ accordion
•	Guided product tour launcher (interactive overlay tour of key features)
•	Contact support form — sends to support email via Spring Boot email service
•	Community guidelines and safety tips
•	Feedback / Feature request form
 
5. Backend API Design
Spring Boot REST Endpoint Overview

5.1  Auth Endpoints
Endpoint	Description
POST /api/auth/register	Create extended user profile in Firestore after Firebase Auth signup
POST /api/auth/verify-token	Validate Firebase JWT and return session info
POST /api/auth/update-profile	Update bio, interests, location, preferences

5.2  Letter Endpoints
Endpoint	Description
POST /api/letters/send	Create letter, calculate delivery time, enqueue in Firestore
GET /api/letters/inbox	Paginated inbox for authenticated user
GET /api/letters/sent	Paginated sent letters
GET /api/letters/in-transit	All letters currently in transit (sent or incoming)
GET /api/letters/:id	Full letter content (auth required, only participants)
GET /api/letters/:id/track	Real-time tracking data (progress, waypoints, ETA)
DELETE /api/letters/:id	Soft-delete letter (moved to archive)
POST /api/letters/:id/report	Report letter for review

5.3  Matching & Discovery Endpoints
Endpoint	Description
GET /api/match/suggestions	Get daily pen pal suggestions ranked by compatibility score
POST /api/match/accept/:userId	Accept a suggestion — creates Pen Pal Request
POST /api/match/pass/:userId	Pass on suggestion — excluded from future suggestions
GET /api/explore/users	Browse users with filters (country, language, interests)
GET /api/explore/map-data	Country-level user density for Explore map bubbles

5.4  Delivery Engine Endpoints
Endpoint	Description
GET /api/delivery/estimate	Calculate estimated delivery time for a given sender/recipient pair + class
GET /api/delivery/classes	List available delivery classes and their multipliers
POST /api/delivery/admin/trigger	Admin only — manually trigger delivery check (dev/testing)

5.5  Notifications
Endpoint	Description
GET /api/notifications	Get paginated notification list for user
POST /api/notifications/mark-read/:id	Mark notification read
POST /api/notifications/mark-all-read	Mark all notifications read
WS /ws/notifications	WebSocket endpoint — real-time notification stream (STOMP)
WS /ws/letter-status/:id	WebSocket — live letter status for in-transit tracking
 
6. Firestore Data Model
NoSQL Document Structure

6.1  Collections Overview
Collection	Purpose
users/{userId}	Profile, preferences, lat/long, stats, subscription tier
letters/{letterId}	Letter content, metadata, status, delivery timeline, attachments
threads/{threadId}	Pen pal correspondence thread — array of letter IDs, participant UIDs
requests/{requestId}	Pen pal requests — sender, recipient, intro message, status
notifications/{notifId}	Notification events — type, userId, payload, read flag
tracking/{letterId}	Delivery tracking — waypoints array, progress, ETA, status timestamps
reports/{reportId}	User/letter reports for moderation
delivery_queue/{letterId}	Scheduler queue — letters awaiting delivery, scheduled_delivery_at

6.2  Letter Document Schema
letters/{letterId} — Key Fields
letterId (string), senderId, recipientId, threadId, subject, body (HTML), stationeryId, stampId, deliveryClass, status [DRAFT|QUEUED|IN_TRANSIT|DELIVERED|READ|ARCHIVED], attachments[] (Storage URLs), created_at, sent_at, scheduled_delivery_at, delivered_at, read_at, distance_km, delivery_duration_ms, sender_location {lat, lng, city, country}, recipient_location {lat, lng, city, country}, reported (bool), deleted_at

6.3  Security Rules (Firestore)
Access Control Principles
Users can only read/write their own profile. Letters: only sender and recipient may read. Only sender may create; no edits after sent_at is set. Tracking: readable by sender and recipient. Requests: sender can create; recipient can update status. Notifications: only the target user may read. Admin SDK (Spring Boot) bypasses rules for the delivery scheduler.
 
7. Pen Pal Matching Algorithm
Compatibility Scoring System

The matching engine runs server-side in Spring Boot as a nightly batch job and on-demand when a user refreshes their suggestions. It scores every eligible user pairing and stores the top 20 matches per user in Firestore for fast retrieval.

7.1  Scoring Dimensions
Dimension	Max Score	Notes
Shared Interests	30 pts
Language Compatibility	25 pts
Letter Frequency Match	15 pts
Location Diversity Score	15 pts
Activity Recency	10 pts
Age Range Overlap	5 pts

7.2  Exclusion Rules
•	Already corresponding (active thread exists)
•	Previously passed / blocked
•	User set to 'invite only' visibility
•	Age range preferences don't mutually overlap
•	User account less than 24 hours old (prevents spam)
 
8. Development Roadmap
Phased Delivery Plan — Antigravity

Phase	Key Deliverables
Phase 1 — Foundation (Weeks 1–4)	Project scaffold, Firebase setup, Spring Boot skeleton, Auth screens (Login/Signup/Verify), Firestore schema, CI/CD pipeline
Phase 2 — Core Loop (Weeks 5–8)	Compose screen, Letter Firestore model, Delivery Engine v1 (scheduler + calculation), Dashboard/Inbox/Sent screens, Letter Detail screen
Phase 3 — Maps & Tracking (Weeks 9–11)	Leaflet integration, Live Tracking screen, Explore map with country bubbles, animated envelope transit
Phase 4 — Discovery (Weeks 12–14)	Matching algorithm, Suggestions screen, Pen Pal Request flow, User Profile screen, Explore filters
Phase 5 — Polish & Notifications (Weeks 15–17)	FCM push notifications, WebSocket real-time updates, Notification Settings, Archive, stationery & stamp picker
Phase 6 — Monetization & Launch (Weeks 18–20)	Subscription screen, Stripe integration, Freemium gating, onboarding tour, Help/FAQ, beta testing, production launch
 
9. Non-Functional Requirements
Performance, Security & Quality

Requirement	Target
Performance	API P95 response < 300ms; Firestore reads < 100ms; Map tiles load < 2s
Scalability	Cloud Run auto-scales to 0; Firestore horizontally scalable by default
Security	Firebase JWT on all API calls; HTTPS everywhere; no PII logged; GDPR-ready
Availability	99.5% uptime SLA; delivery scheduler has retry logic with exponential backoff
Accessibility	WCAG 2.1 AA; keyboard navigable; screen reader tested with NVDA/VoiceOver
Mobile Responsive	Full mobile-first responsive design; PWA-ready (offline draft saving)
Internationalisation	i18next; RTL layout support; date/time formatted by user locale
Delivery Reliability	Delivery scheduler is idempotent; uses Firestore transactions; no double-delivery
 
10. Glossary
Key Terms & Definitions

Term	Definition
Delivery Engine	Spring Boot subsystem that calculates and enforces simulated letter delivery delays
Jitter	±20% random variation added to delivery time to simulate real postal unpredictability
Haversine Formula	Mathematical formula to calculate great-circle distance between two lat/long points
IN_TRANSIT	Firestore letter status: sent but not yet delivered to recipient
Stationery	Visual paper style applied to a letter (texture, colour, ruling, borders)
Thread	A bi-directional correspondence chain between two users, containing all their letters
Postage Credit	In-app currency for purchasing Express delivery sends
FCM	Firebase Cloud Messaging — used to send push notifications to users' devices
STOMP	Streaming Text Oriented Messaging Protocol — used for WebSocket messaging in Spring
Antigravity	The development agency building and delivering the PenPal platform

— End of Document —
Khitab ·  Antigravity  ·  Confidential v1.0
