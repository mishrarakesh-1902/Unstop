# 🚀 ET AI Concierge

**ET AI Concierge** is a hyper-personalized financial assistant designed for the modern investor. Built for the **Unstop / Economic Times Hackathon**, this platform leverages cutting-edge AI to provide real-time investment strategies, global user profiling, and a seamless market experience.

---

## ✨ Key Features

- **🤖 AI Financial Concierge**: A dedicated chat assistant that understands your financial goals and provides tailored investment advice using Google Gemini and OpenAI.
- **📈 LIVE Market Matrix**: Real-time tracking of Nifty 50, Sensex, Gold, and other critical market indicators.
- **👤 Global Profiling**: A 2-minute onboarding process that builds a comprehensive financial persona for every user.
- **📰 ET Prime Integration**: Curated investment ideas and top stories straight from the Economic Times ecosystem.
- **🎥 Trending Media**: A rich multimedia experience with trending financial news videos and articles.
- **⚡ Premium UI/UX**: A state-of-the-art interface built with Next.js, Framer Motion, and Tailwind CSS for a buttery-smooth experience.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with **TypeScript**
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **AI Models**: Google Gemini Pro & OpenAI GPT-4

---

## 📂 Project Structure

```bash
ET_AI_HACKATHON/
├── backend/                # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/         # API Endpoints (chat, profile)
│   │   ├── services/       # AI Logic (Gemini, OpenAI, Recommendations)
│   │   └── index.ts        # Server Entry Point
│   └── .env                # Backend Environment Variables
├── et-ai-concierge/        # Next.js Frontend
│   ├── src/
│   │   ├── app/            # Pages & Routing (Next.js App Router)
│   │   └── components/     # UI Components & Layouts
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- API Keys for Google Gemini or OpenAI

### 1. Setup Backend
```bash
cd backend
npm install
# Create a .env file based on the environment variables section below
npm run dev
```

### 2. Setup Frontend
```bash
cd et-ai-concierge
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with the following keys:

```bash
PORT=8000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

---

## 🏆 Hackathon Submission
This project is submitted for the **ET AI Hackathon**. It demonstrates the power of Generative AI in transforming traditional financial news into an interactive, personalized advisory ecosystem.

---

## 📄 License
This project is for hackathon demonstration purposes.
