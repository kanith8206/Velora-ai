<div align="center">

<img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop" alt="Velora AI Header" width="100%" style="border-radius: 15px; margin-bottom: 20px;"/>

# ✦ Velora AI ✦

<h3 align="center">
  The Future of E-Commerce is Conversational & Lightning Fast
</h3>

<p align="center">
  <strong>Intelligent Shopping • Ultra-Low Latency Inference • Personalized Choices</strong>
</p>

<p align="center">
  <a href="#-core-features">Features</a> •
  <a href="https://velora-ai.vercel.app/">Live Demo</a> •
  <a href="#-performance--speed">Performance</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-quick-start-run-locally">Quick Start</a>
</p>

<div align="center">
  
  [![React](https://img.shields.io/badge/React-19-000000?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-5.0-000000?style=for-the-badge&logo=vite&logoColor=646CFF)](https://vitejs.dev)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-000000?style=for-the-badge&logo=tailwindcss&logoColor=38B2AC)](https://tailwindcss.com)
  [![Groq](https://img.shields.io/badge/Powered_by-Groq_AI-000000?style=for-the-badge&logo=ai&logoColor=f472b6)](https://groq.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth-000000?style=for-the-badge&logo=firebase&logoColor=FFCA28)](https://firebase.google.com/)
  
</div>

---

</div>

<br/>

## 🌌 The Vision

Traditional online shopping is broken. You spend hours reading fake reviews, comparing meaningless specifications, and scrolling through endless pages of irrelevant products. 

**Velora AI** is a paradigm shift. We’ve built an ultra-premium, AI-native shopping consultant that acts as your personal concierge. You don't search; you *converse*. Powered by **Groq's LPU™ Inference Engine**, Velora parses your exact intent, budget, and aesthetic preferences to curate the perfect products in milliseconds. 

<br/>

## ⚡ Performance & Speed

By utilizing **Groq AI**, Velora achieves unprecedented responsiveness. 
Traditional LLM integrations leave users staring at loading spinners while they wait for shopping recommendations. With Groq's deterministic Tensor Streaming Architecture, Velora delivers rich, context-aware product recommendations and synthesized pros/cons at **over 800 tokens per second**. The shopping experience feels instantaneous, fluid, and magical.

<br/>

## ✨ Core Features

<details open>
<summary><b>💬 Conversational AI Concierge</b></summary>
<br/>
Forget keyword searches. Just type exactly what you want: 
<br/><br/>
<kbd> "Find me a great espresso machine under $500 for a beginner, but it needs to look good in a minimalist kitchen."</kbd>
<br/><br/>
Velora understands the context and instantly builds a customized UI carousel of perfect matches right inside the chat window.
</details>

<details open>
<summary><b>👁️ Multimodal Visual Search</b></summary>
<br/>
See a gadget you like on social media? Just upload a screenshot. Velora uses advanced multimodal vision processing to analyze the image, identify the product, and recommend exactly what you're looking for.
</details>

<details open>
<summary><b>⚖️ Intelligent Comparison Matrix</b></summary>
<br/>
Select multiple products and let Velora do the heavy lifting. Our AI dynamically generates:
<ul>
  <li>🏆 <b>Categorized Verdicts:</b> (Best Overall, Best Budget, Premium Pick)</li>
  <li>✅ <b>Pros & Cons:</b> Synthesized from thousands of data points and user reviews.</li>
  <li>📊 <b>Grouped Specifications:</b> Tech specs elegantly categorized for easy reading (Display, Performance, Battery, etc.).</li>
</ul>
</details>

<details open>
<summary><b>🎯 Smart User Dashboard</b></summary>
<br/>
Every user gets a personalized dashboard featuring:
<ul>
  <li><b>Saved Wishlists:</b> Instantly access products you've bookmarked.</li>
  <li><b>Conversation History:</b> Pick up your shopping consultation right where you left off.</li>
  <li><b>Smart Recommendations:</b> AI-driven suggestions based on your recent activity.</li>
</ul>
</details>

<br/>

## 🎨 Ultra-Premium UI/UX

Velora AI is designed to look and feel like a luxury digital experience:
* **Glassmorphism & Neon Highlights:** Deep dark mode with vibrant, context-aware glowing accents.
* **Framer Motion Micro-interactions:** Every button press, modal open, and page transition is governed by smooth spring physics.
* **Component-Driven Design:** A highly modular, easily scalable React architecture ensuring a responsive layout across mobile and desktop.
* **Dynamic Highlight Grids:** Complex technical data is automatically transformed into beautiful, icon-rich highlight cards.

---

## 🛠️ Key Workflows

### The Buyer's Journey
1. **Authentication:** The user securely logs in via Firebase (Google/Email).
2. **Consultation:** The user opens the Chat interface and describes their needs in natural language.
3. **Inference (Groq):** The Express backend securely forwards the prompt to Groq. The model retrieves context from the product database and streams back a structured response.
4. **Rendering:** The React frontend intercepts product IDs within the AI response and dynamically renders rich interactive `ProductCard` components inline with the text.
5. **Evaluation:** The user adds top choices to their Comparison Matrix to view AI-generated pros/cons.

---

## 🏗️ Architecture

Velora uses a modern, lightweight, but immensely powerful tech stack optimized for speed and DX (Developer Experience):

```mermaid
graph TD;
    Client[React 19 Frontend] -->|Zustand State| Store;
    Client -->|API Requests| Express[Node.js Backend];
    Express -->|Lightning Fast Prompts| Groq[Groq AI API];
    Client -->|Auth & Sync| Firebase[(Firebase Auth & DB)];
    Express -->|JSON Response| Client;
```

### Component Breakdown
* **Frontend:** React 19, Vite, Tailwind CSS v3, Framer Motion, Zustand, React Router v6, Lucide Icons.
* **Backend:** Node.js, Express.js.
* **AI Integration:** `groq-sdk`.
* **Database & Auth:** Firebase.

---

## 🚀 Quick Start (Run Locally)

Get your own lightning-fast personal AI shopper running in less than 2 minutes.

### 1. Prerequisites
* **Node.js** (v18+)
* **Groq API Key** ([Get it for free at GroqCloud](https://console.groq.com/))
* **Firebase Project** (Configured for web authentication)

### 2. Setup

```bash
# Clone the repository
git clone https://github.com/kanith8206/Velora-ai.git

# Navigate to the directory
cd velora-ai

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root folder and add your secret keys. Make sure to include your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Ignite 🔥
Run the magic command to start both the Vite frontend and Express backend simultaneously:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser and experience instant AI shopping!

---

## 🛡️ Security & Privacy
* **Secure API Routing:** All Groq API calls are handled server-side via Express to protect your private API keys from being exposed to the client browser.
* **Authenticated Sessions:** Firebase handles secure JWT token management to ensure user data (Wishlists, Chat History) remains private.

---

## 🛣️ Roadmap
- [ ] **Stripe Integration:** Enable seamless 1-click checkouts directly from the chat interface.
- [ ] **Voice Input:** Allow users to talk to Velora using Web Speech API.
- [ ] **Real-time Pricing:** Integrate with third-party web scrapers to fetch live prices and stock availability.

---

<div align="center">
  <br/>
  <i>Crafted with passion for the future of e-commerce.</i>
  <br/><br/>
  <b>If you found this project inspiring, please consider leaving a ⭐️</b>
</div>
