import { IUserProfile } from '../models/UserProfile';

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  category: "ET_ECOSYSTEM" | "PARTNER_SERVICE";
  action: string;
  url: string;
  ctaColor?: string;
}

export function generateRecommendations(profile: Partial<IUserProfile>): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const goals = profile.goals?.map(g => g.toLowerCase()) || [];
  const interests = profile.interests?.map(i => i.toLowerCase()) || [];
  const risk = profile.risk_level?.toLowerCase() || '';
  const experience = profile.investment_experience?.toLowerCase() || '';

  // 1. ET Prime Logic (Deep Insights for Growth/Stocks/Goals)
  if (goals.some(g => g.includes('growth') || g.includes('wealth') || g.includes('house') || g.includes('car')) || interests.some(i => i.includes('stock') || i.includes('equity'))) {
    recommendations.push({
      id: "et-prime",
      category: "ET_ECOSYSTEM",
      title: "ET Prime Membership",
      reason: goals.some(g => g.includes('house')) 
        ? "To save for a down payment effectively, you need sectoral insights on real estate and high-yield debt instruments found exclusively on ET Prime."
        : "To achieve your financial goals, you need deep-dive tech and market analysis that goes beyond the headlines.",
      action: "Subscribe to Prime",
      url: "https://economictimes.indiatimes.com/prime",
      ctaColor: "#FFD700" // Gold
    });
  }

  // 2. ET Markets Logic (Aggressive / Intermediate-Advanced)
  if (risk.includes('aggressive') || risk.includes('high') || experience === 'advanced' || experience === 'intermediate') {
    recommendations.push({
      id: "et-markets",
      category: "ET_ECOSYSTEM",
      title: "ET Markets Pro",
      reason: "Access real-time charting, advanced screeners, and expert trading ideas tailored for aggressive risk profiles.",
      action: "Launch Markets Pro",
      url: "https://economictimes.indiatimes.com/markets",
      ctaColor: "#ED1B24" // ET Red
    });
  }

  // 3. Masterclass Logic (Beginners / Skill building)
  if (experience === 'beginner' || !experience) {
    recommendations.push({
      id: "masterclass-beginner",
      category: "ET_ECOSYSTEM",
      title: "ET Masterclass: Investment Basics",
      reason: "Build a strong foundation and learn the basics of investing hosted by top ET financial experts.",
      action: "Register for Webinar",
      url: "https://www.etmasterclass.com",
      ctaColor: "#4A90E2" // Blue
    });
  } else if (interests.some(i => i.includes('fno') || i.includes('options'))) {
    recommendations.push({
      id: "masterclass-advanced",
      category: "ET_ECOSYSTEM",
      title: "ET Masterclass: Advanced Options",
      reason: "Perfect your derivatives strategy with frameworks designed by elite traders.",
      action: "Enroll in Masterclass",
      url: "https://www.etmasterclass.com",
      ctaColor: "#7B61FF" // Purple
    });
  }

  // 4. Cross-Sell / Financial Services Logic (Loans, Credit Cards based on income)
  if (profile.income_level && (profile.income_level.includes('30L') || profile.income_level.includes('1Cr'))) {
    recommendations.push({
      id: "premium-credit-card",
      category: "PARTNER_SERVICE",
      title: "ET Partner: Premium Wealth Credit Card",
      reason: "Based on your income bracket, you qualify for a premium card offering free lounge access and high reward multipliers.",
      action: "Apply with 1-Click",
      url: "https://www.etmoney.com/credit-cards",
      ctaColor: "#000000" // Black
    });
  }

  return recommendations;
}

export function detectFinancialGaps(profile: Partial<IUserProfile>): string[] {
  const gaps: string[] = [];
  const risk = profile.risk_level?.toLowerCase() || '';
  const income = profile.income_level?.toLowerCase() || '';
  const goals = profile.goals?.map(g => g.toLowerCase()) || [];

  // Gap 1: Under-insured based on High Income
  if (income.includes('30l') || income.includes('1cr')) {
    gaps.push("Under-insured: High net-worth implies a need for a robust term life policy and asset protection. Explore ET Insurance partners.");
  }
  
  // Gap 2: High Risk Concentration
  if (risk.includes('aggressive')) {
    gaps.push("High Risk Concentration: While aiming for high returns, ensure at least 15% of your portfolio is in debt or fixed-income to hedge against volatility.");
  }

  // Gap 3: Missing Tax planning
  if (!goals.some(g => g.includes('tax'))) {
    gaps.push("Tax Inefficiency: You haven't mentioned tax saving. Utilize ELSS mutual funds under Section 80C to optimize your returns.");
  }

  return gaps;
}
