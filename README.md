# Meal Rescue Planner - Frontend

A beautiful and responsive React application to help manage meals, discover recipes based on weather, and generate weekly meal plans.

**Live App:** [https://meal-rescue-planner-frontend-cxgj.vercel.app/](https://meal-rescue-planner-frontend-cxgj.vercel.app/)

## Features

- ✨ **AI-Powered Suggestions**: Get meal recommendations tailored to current weather conditions.
- 📅 **7-Day Meal Planning**: Automatically generate a full week of meals based on your preferences.
- 💾 **Meal Vault**: Store and manage your favorite meals.
- 🔐 **Secure Authentication**: Custom JWT-based login and signup.
- 🎨 **Modern UI**: Built with Mantine UI and Tabler Icons.

## Tech Stack

- **React** with **Vite**
- **Mantine UI** for components and styling
- **React Query** for efficient data fetching and caching
- **Axios** for API communication
- **JWT Decode** for session management

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
Create or update `src/config.js`:
```javascript
export const API_URL = 'your_backend_api_url';
```

### 3. Start Development Server
```bash
npm run dev
```

## Deployment

The application is optimized for deployment on **Vercel**.
