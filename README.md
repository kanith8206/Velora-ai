# Velora AI 🛍️✨

**"Intelligent Shopping. Personalized Choices."**

Velora AI is a world-class premium shopping assistant and consultant. Powered by Google's Gemini AI, Velora acts as a high-end personal shopper, understanding your intent, budget, and preferences to curate tailored product recommendations and provide insightful comparisons.

## ✨ Features

- **Conversational AI Shopping Assistant:** Chat naturally with Velora to find exactly what you need.
- **Dynamic AI Product Generation:** If a specific request isn't in the curated catalog, Velora dynamically generates highly realistic recommendations with believable specifications.
- **Visual Search:** Upload images for Velora to analyze and find matching products.
- **Intelligent Comparisons:** Get structured comparisons of products with "Pros & Cons" and clear verdicts (Best Overall, Best Budget, etc.).
- **User Authentication:** Secure sign-up and login powered by Firebase.
- **Personalized Experience:** Manage your profile, wishlist, and view your personalized dashboard.
- **Premium UI:** A sleek, modern, and elegant dark-themed interface built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Zustand (State Management), React Router
- **Backend:** Node.js, Express.js
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Authentication & Database:** Firebase

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A Google Gemini API Key (Get one at [Google AI Studio](https://aistudio.google.com/))
- Firebase Project configured (for authentication)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd velora-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Update the `.env` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   This will start both the Express backend and the Vite frontend simultaneously. The app will be running at `http://localhost:3000`.

### Production Build

To build the application for production:
```bash
npm run build
```
To start the production server:
```bash
npm start
```

## 📂 Project Structure

- `/src`: Contains the React frontend code (components, pages, store, etc.).
- `server.js`: The Express backend handling API routes and Gemini AI integration.
- `src/productsData.js`: The local curated product catalog.
- `src/firebase.js`: Firebase configuration and initialization.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is intended for demonstration purposes.
