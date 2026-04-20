# Khitab Frontend — The Scriptorium

This is the React-based web application for the Khitab platform. It is designed to provide a premium, "Digital Heirloom" drafting and reading experience.

## 🎨 Design Philosophy
- **Editorial Typography**: Uses `Noto Serif` for a traditional felt.
- **Paper Aesthetics**: Custom textures and glassmorphism.
- **Smooth Motion**: Framer Motion for cinematic transitions.

## 🛠️ Architecture
The frontend follows a strict **MVVM (Model-View-ViewModel)** pattern:
- **Views**: `/src/pages` — Clean UI components.
- **ViewModels**: `/src/viewmodels` — Logic and state management using custom hooks.
- **Models**: `/src/services` — API and Data access.

## 🚀 Getting Started

### 1. Environment Configuration
Ensure your Firebase configuration is set in `src/firebase/config.js`.

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Mode
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---
Created by **Mohd Azad Chaudhary**.
