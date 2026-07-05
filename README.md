<div align="center">

<img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop" alt="Velora AI Banner" width="100%" style="border-radius: 12px;"/>

# ✨ Velora AI 

**Intelligent Shopping. Personalized Choices.**

A world-class premium shopping assistant and consultant powered by Google's Gemini AI. Velora acts as your high-end personal shopper, understanding your intent, budget, and preferences to curate tailored product recommendations and provide insightful comparisons.

[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Powered_by-Gemini_AI-F25F33?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

[Live Demo](https://velora-ai.vercel.app/) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 🌟 Why Velora AI?

E-commerce is overwhelming. Endless scrolls, fake reviews, and confusing technical specifications make finding the perfect product a chore. **Velora AI** transforms this experience. Instead of searching, you *converse*. Instead of comparing spreadsheets, Velora presents *intelligent, synthesized verdicts*. 

Built with an ultra-premium, sleek dark-mode aesthetic, Velora is designed not just to be a tool, but a luxurious digital experience.

---

## ✨ Groundbreaking Features

### 🤖 Conversational AI Personal Shopper
Chat naturally with Velora. Ask things like:
> *"I need a laptop for video editing under $1500, but I hate Apple products."* 

Velora parses your intent and instantly builds a curated carousel of exact matches right inside the chat window.

### 📸 Visual Search & Analysis
Upload an image of a gadget or aesthetic you like. Velora uses state-of-the-art multimodal AI vision to analyze the image, identify the product, and find exactly what you're looking for.

### ⚖️ Intelligent Matrix Comparisons
Select multiple products and hit **Compare**. Instead of a static table, Velora dynamically generates:
- 🏆 **Clear Verdicts:** Best Overall, Best Budget, Premium Pick.
- ✅ **Pros & Cons:** AI-synthesized lists to help you decide fast.
- 📊 **Grouped Technical Specifications:** Detailed metrics neatly organized by category (Display, Performance, Battery, etc.).

### 🎨 Ultra-Premium UI/UX
- **Glassmorphism & Neon Accents:** Beautiful gradients and blurs.
- **Framer Motion Micro-interactions:** Smooth animations, hover effects, and spring-physics page transitions.
- **Dynamic Highlights:** Complex technical data transformed into beautiful, icon-rich highlight grids.

---

## 🛠️ Architecture & Tech Stack

Velora AI is built using the bleeding edge of modern web development:

| Area | Technology |
|---|---|
| **Frontend Framework** | React 19 (via Vite) |
| **Styling & Animation** | Tailwind CSS v3, Framer Motion, Lucide Icons |
| **State Management** | Zustand (Persistent Local Storage) |
| **Routing** | React Router v6 |
| **Backend / API** | Node.js, Express.js |
| **Artificial Intelligence**| Google `@google/genai` (Gemini 1.5 Flash/Pro) |
| **Database & Auth** | Firebase |

---

## 🚀 Quick Start Guide

Want to run Velora AI locally? Follow these steps to spin up your own premium shopping assistant.

### 1. Prerequisites
- Node.js (v18+ recommended)
- A **Google Gemini API Key** (Get one at [Google AI Studio](https://aistudio.google.com/))
- A Firebase Project (for Authentication)

### 2. Installation

Clone the repository and install the dependencies:
```bash
git clone https://github.com/kanith8206/Velora-ai.git
cd velora-ai
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your secret keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Fire It Up! 🔥
Run the magic command to start both the Vite frontend and Express backend simultaneously:
```bash
npm run dev
```
> The application will launch at **`http://localhost:3000`**

---

## 📁 Project Anatomy

```text
velora-ai/
├── src/
│   ├── components/      # Reusable UI components (ProductCard, Navbar, etc.)
│   ├── pages/           # Main views (Home, Chat, ProductDetails, Comparison)
│   ├── store.js         # Zustand state management (Auth, Chat, Wishlist)
│   ├── productsData.js  # Curated high-fidelity mock database 
│   └── firebase.js      # Firebase configuration
├── server.js            # Express backend & Gemini AI integration bridge
├── tailwind.config.js   # Custom design system tokens and colors
└── index.html           # Application entry point
```

---

<div align="center">
  
**Designed with passion for the future of e-commerce.**

If you love Velora AI, please give this repository a ⭐️ to show your support!

</div>
