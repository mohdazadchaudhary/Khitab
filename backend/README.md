# Khitab Backend — The Postal Service

This is the Spring Boot based server for the Khitab platform. It handles the core "Time Delay Delivery Engine," secure authentication via Firebase, and persistence using Firestore.

## 🛠️ Technology Stack
- **Framework**: Spring Boot 3.2.4 (Java 21)
- **Database**: Google Cloud Firestore
- **Security**: Spring Security + Firebase Admin SDK
- **Scheduling**: @Scheduled for the Delivery Worker

## 🏗️ Architecture
The backend follows a **Clean Architecture** approach:
- **Controllers**: REST API entry points.
- **DTOs**: Data Transfer Objects for decoupled communication.
- **Services**: Business logic (Haversine calculations, transit logic).
- **Repositories**: Firestore abstraction layer.

## 🚀 Getting Started

### 1. Prerequisites
- Java 21 LTS
- Maven 3.9+
- A `serviceAccountKey.json` placed in `src/main/resources/`.

### 2. Configuration
The primary configuration is handled in `src/main/resources/application.yml`. 

### 3. Running the Server
```bash
mvn spring-boot:run
```

## 📬 Core Endpoints
- `POST /api/auth/register`: User profile synchronization.
- `POST /api/letters/send`: Dispatch a new letter.
- `GET /api/letters/mailbox`: Retrieve received letters.
- `GET /api/letters/in-transit`: Track letters currently crossing the digital distance.
