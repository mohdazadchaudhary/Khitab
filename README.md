# ✉️ Khitab — Digital Pen Pal Platform

> **"Write. Wait. Wonder."**

Khitab is a "Digital Heirloom" platform designed to revive the art of letter writing. Unlike modern instant messaging, Khitab introduces intentional friction through its signature **Delivery Engine**, simulating realistic postal transit times based on geographic distance between correspondents.

---

## 🌟 The Vision: "Slow-Tech"

In an era of instant gratification, Khitab encourages emotional investment and patience. 
- **Authentic Connection**: Discovery via shared interests, not social graphs.
- **Intentional Friction**: Letters take hours or days to arrive, creating genuine anticipation.
- **Visual Storytelling**: Watch your letter's journey across a live world map.

---

## 🚀 Key Features

- **📬 Time-Delay Delivery Engine**: Uses the Haversine formula to calculate real-world transit times (30 mins to 3 days).
- **🗺️ Live Map Tracking**: Interactive Leaflet maps show animated postal routes for every letter en route.
- **🧠 AI Matchmaking**: Discovery scoring that prioritizes shared fascinations and complementary locations.
- **📜 Immersive Drafting**: A premium, borderless "Scriptorium" experience with paper textures and editorial typography.
- **🔐 Secure & Private**: Firebase JWT authentication with a dedicated Spring Security backend.

---

## 📸 Visual Showcase

### 🛬 Landing Page
The gateway to the "Slow-Tech" experience.
![Khitab Landing](screenshots/landing.png)

### 🗺️ Live Tracking & Dashboard
Watch your letters travel across the globe in real-time.
| In Transit (Tracking) | Inbox (The Desk) |
| :---: | :---: |
| ![Tracking Map](screenshots/tracking.png) | ![Dashboard Inbox](screenshots/dashboard.png) |

### 🖋️ Scriptorium & Identity
Compose letters in an immersive editor and manage your digital legacy.
| Drafting a Letter | User Profile |
| :---: | :---: |
| ![Compose Screen](screenshots/compose.png) | ![Profile Screen](screenshots/profile.png) |

---

## 🏗️ Architecture

### 2.1 System Overview
```mermaid
graph TD
    User((User))
    Web[React Frontend]
    API[Spring Boot Backend]
    Auth[Firebase Auth]
    DB[(Firestore DB)]
    Scheduler[Delivery Scheduler]

    User <--> Web
    Web <--> Auth
    Web <--> API
    API <--> Auth
    API <--> DB
    Scheduler <--> DB
    Scheduler -.->|Update Status| DB
```

### 2.2 Letter Exchange Flow
```mermaid
sequenceDiagram
    participant S as Sender (Client)
    participant B as Backend
    participant D as Firestore
    participant W as Scheduler (Worker)
    participant R as Recipient (Client)

    S->>B: POST /api/letters/send (Content, RecipientId)
    B->>B: Calculate Haversine Distance
    B->>B: Calculate Delay + Jitter
    B->>D: Save Letter (Status: TRANSIT, deliverAt: T+Delay)
    Note over W: Every 60 seconds
    W->>D: Query Letters where Status=TRANSIT & deliverAt <= Now
    D-->>W: List of ready letters
    W->>D: Update Status to DELIVERED
    W->>R: WebSocket Notification / Push
```

---

## 💻 Tech Stack

### Backend
- **Runtime**: Java 21 LTS
- **Framework**: Spring Boot 3.2.4
- **Security**: Spring Security + Firebase Admin SDK
- **Database**: Google Cloud Firestore (NoSQL)
- **Task Scheduling**: Spring `@Scheduled`

### Frontend
- **Library**: React 19 (Vite 8)
- **Styling**: Tailwind CSS ("Digital Heirloom" palette)
- **Animations**: Framer Motion
- **Maps**: Leaflet.js

---

## 📁 Project Structure

```text
Khitab/
├── backend/            # Spring Boot Application
│   ├── src/main/java/  # Clean Architecture (Controller, DTO, Model, Repository, Service)
│   └── src/resources/  # Configuration & Secrets
├── frontend/           # React + Vite Application
│   ├── src/components/ # Atomic UI components (Button, Card, Map)
│   ├── src/pages/      # Feature screens (Dashboard, Compose, Tracking)
│   ├── src/viewmodels/ # MVVM Logic (React Hooks)
│   └── src/services/   # API Layer
├── DESIGN.md           # Design System & Visual Identity
├── NEXT_STEPS.md       # Future Roadmap
└── done.md             # Completed Milestone Log
```

---

## 🚀 How to Set Up & Run

### 1. Prerequisites
- **Java 21 LTS** & Maven
- **Node.js** (v18+)
- **Firebase Project**: Set up a project in the [Firebase Console](https://console.firebase.google.com/).

### 2. Firebase Configuration
1.  **Firestore**: Create a database in "Native mode".
2.  **Auth**: Enable Email/Password provider.
3.  **Service Account**: Go to Project Settings > Service Accounts > Generate new private key. Save it as `backend/src/main/resources/serviceAccountKey.json`.
4.  **Web App**: Register a web app and copy the `firebaseConfig` object into `frontend/src/firebase/config.js`.

### 3. Execution Process

#### Step A: Start the Backend
Open a terminal in the root directory and run:
```bash
cd backend
mvn spring-boot:run
```
The server will start on `http://localhost:8080`.

#### Step B: Start the Frontend
Open a **new** terminal in the root directory and run:
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🛣️ Roadmap: The Next Horizon

- [ ] **Real-Time Push**: WebSocket integration for instant arrival notifications.
- [ ] **Stationery Gallery**: Multiple paper textures and custom Wax Seals.
- [ ] **Reverse Geocoding**: Automatic city/country resolution from GPS.
- [ ] **Mobile Companion**: Native haptic notifications for letter arrivals.

---

## 🖋️ License
Created by **Mohd Azad Chaudhary**.
