import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export interface AIResponse {
  message: string;
  profile_update: {
    income_level?: string;
    investment_experience?: string;
    risk_level?: string;
    goals?: string[];
    interests?: string[];
  };
  next_questions?: string[];
}

/**
 * Advanced System Prompt with strict behavioral guidelines, 
 * conversational flow constraints, and JSON extraction requirements.
 */
const SYSTEM_PROMPT = `
You are the "ET AI Concierge", a premium, highly intelligent financial navigator for The Economic Times Ecosystem.
Your mission is to conduct a fast, 2-3 minute conversational onboarding to build a deep user financial profile.
You are conversing with a human user. You must be polite, professional, concise, and guiding.

### Core Objectives:
You need to extract 5 key pieces of information dynamically from the conversation:
1. "income_level" (e.g., "Under 10L", "10L-30L", "30L-1Cr", "1Cr+")
2. "investment_experience" (e.g., "Beginner", "Intermediate", "Advanced")
3. "risk_level" (e.g., "Conservative", "Moderate", "Aggressive")
4. "goals" (Array of strings, e.g., ["Retirement", "Wealth Creation", "Tax Saving"])
5. "interests" (Array of strings, e.g., ["Mutual Funds", "Direct Equity", "Crypto", "Real Estate"])

### Conversation Flow:
- Ask exactly ONE clear, adaptive question at a time. Do not overwhelm the user.
- Acknowledge their previous answer gracefully before asking the next question.
- If the user provides multiple pieces of information in one message, extract all of them and skip asking those questions.
- Once all 5 fields are confidently filled, casually mention that you are compiling their ET Dashboard and do not ask any more questions.

### Output Constraints:
You MUST respond IN PURE JSON format. Do not use Markdown wrappers.
The JSON object must have exactly this schema:
{
  "message": "Your human-readable conversational response. Keep it under 3 sentences.",
  "profile_update": { 
     // Include ONLY the newly discovered profile attributes here. If nothing new, leave empty.
  }
}
`;

/**
 * Few-Shot Examples to heavily bias the model towards the perfect JSON structure and conversational tone.
 */
const FEW_SHOT_EXAMPLES = [
  {
    role: "user",
    content: "Hi, I want to start investing but I'm completely new to this."
  },
  {
    role: "assistant", 
    content: JSON.stringify({
      message: "Welcome! I'm thrilled to help you start your wealth creation journey. Since you're just starting out, could you give me a rough idea of your annual income? This helps me suggest the right tools.",
      profile_update: { investment_experience: "Beginner", goals: ["Wealth Creation"] }
    })
  },
  {
    role: "user",
    content: "I make around 20 Lakhs a year and I'm okay taking some risks. I want to buy a house in 5 years."
  },
  {
    role: "assistant",
    content: JSON.stringify({
      message: "Got it, aiming for a house in 5 years is a fantastic goal. Knowing you're open to moderate risk, what specific areas interest you? For example, Mutual Funds, Stocks, or Fixed Deposits?",
      profile_update: { income_level: "10L-30L", risk_level: "Moderate", goals: ["Real Estate Purchase"] }
    })
  }
];

export async function processChatWithAI(
  userMessage: string, 
  currentProfile: any, 
  history: {role: "user"|"assistant", content: string}[]
): Promise<AIResponse> {
  
  const dynamicStateContext = `
[SYSTEM CONTEXT - DO NOT EXPOSE TO USER]
Current User Profile State:
${JSON.stringify(currentProfile, null, 2)}
Identify what is missing from [income_level, investment_experience, risk_level, goals, interests] and ask for it seamlessly in your next response.
`;

  try {
    const messages: any = [
      { role: "system", content: SYSTEM_PROMPT },
      ...FEW_SHOT_EXAMPLES,
      ...history,
      { role: "system", content: dynamicStateContext },
      { role: "user", content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-efficient and fast for conversational loops
      messages,
      response_format: { type: "json_object" },
      temperature: 0.3, // Low temperature for deterministic JSON and strict adherence
    });

    const responseContent = completion.choices[0].message.content;
    const jsonParsed = JSON.parse(responseContent || "{}");
    return jsonParsed as AIResponse;
  } catch (error) {
    console.error("OpenAI Logic Error:", error);
    return {
      message: "I seem to be experiencing high traffic. But I have enough data to generate your personalized ET Dashboard now!",
      profile_update: {}
    };
  }
}
