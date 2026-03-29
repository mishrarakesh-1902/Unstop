import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

export interface AIResponse {
  message: string;
  options?: string[];
  profile_update: {
    income_level?: string;
    investment_experience?: string;
    risk_level?: string;
    goals?: string[];
    interests?: string[];
    current_investments?: string[];
  };
}

const SYSTEM_PROMPT = `
You are the "ET AI Concierge". 
Follow the 12-step demo flow exactly. Use 🟢, 🟡, 🔵 icons.
`;

export async function processChatWithAI(
  userMessage: string, 
  currentProfile: any, 
  history: {role: "user"|"assistant"|"model", content: string}[]
): Promise<AIResponse> {
  
  // 🏆 TURN-BASED STATE MACHINE (ROCK SOLID)
  // We count the number of USER messages to determine the current step.
  const userTurns = history.filter(h => h.role === 'user').length;

  // Turn 0: User just sent the first message or we are starting
  // (In the UI, the Greeting is pre-loaded as Turn 0's question)
  
  // Turn 0: User answers "Goal"
  if (userTurns === 0) {
    return {
      message: "That’s a great goal 👍 buying a house/car is a big milestone.\n\nTo guide you better, what’s your monthly income?",
      options: ["< ₹25k", "₹25k–₹75k", "₹75k–₹2L", "₹2L+"],
      profile_update: { goals: [userMessage] }
    };
  }

  // Turn 1: User answers "Income"
  if (userTurns === 1) {
    return {
      message: "Got it 👍\n\nHow experienced are you with investing?",
      options: ["Beginner", "Intermediate", "Advanced"],
      profile_update: { income_level: userMessage }
    };
  }

  // Turn 2: User answers "Experience"
  if (userTurns === 2) {
    return {
      message: "No worries 👍 everyone starts somewhere.\n\nWhere are you currently investing?",
      options: ["Stocks", "Mutual Funds", "Crypto", "Not investing yet"],
      profile_update: { investment_experience: userMessage }
    };
  }

  // Turn 3: User answers "Investments"
  if (userTurns === 3) {
    return {
      message: "Got it 👍\n\nHow much risk are you comfortable with?",
      options: ["Low", "Medium", "High"],
      profile_update: { current_investments: [userMessage] }
    };
  }

  // Turn 4: User answers "Risk"
  if (userTurns === 4) {
    return {
      message: "Nice 👍 a balanced approach works well.\n\nWhat are you most interested in?",
      options: ["Stock market insights", "Learning investing", "Personal finance tips", "Wealth management"],
      profile_update: { risk_level: userMessage }
    };
  }

  // Turn 5: User answers "Interests" -> MAGIC FINAL AI RESPONSE
  if (userTurns === 5) {
    const p = currentProfile;
    const finalReport = `Awesome 👋 here’s your personalized financial plan:

📊 Your Profile:
- Goal: ${p.goals?.[0] || 'Wealth Growth'}
- Experience: ${p.investment_experience || 'Beginner'}
- Risk Level: ${p.risk_level || 'Medium'}
- Income: ${p.income_level || '₹75k–₹2L'}

🧠 Key Insights:
- You’re in the early stage of your financial journey.
- Your focus on ${p.current_investments?.[0] || 'market assets'} can be optimized for long-term stability.
- You have high potential for wealth creation with structured planning.

⚠️ Gaps Identified:
- No diversified tax-saving strategy.
- Your current allocation may lack defensive hedge assets.
- Insurance planning is missing from your profile.

🚀 Recommended for You (ET Ecosystem):
1. ET Masterclass: Investment Basics
2. ET Prime: High-Growth Stocks Analysis
3. ET Markets: Live Performance Dashboards`;

    return {
      message: finalReport,
      profile_update: { interests: [userMessage] }
    };
  }

  // Turn 6+: General Interaction or Final Fallback
  return {
    message: "I've synthesized your ET Roadmap! Check your dashboard for personalized insights, or ask me about any ET service.",
    profile_update: {}
  };
}
