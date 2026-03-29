import { Router } from "express";
import { processChatWithAI } from "../services/gemini";
import { generateRecommendations, detectFinancialGaps } from "../services/recommendationEngine";
import { getProfile, updateProfile } from "../services/dbStore";

const router = Router();

router.post("/", async (req, res) => {
  const { sessionId, message, history = [] } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message are required" });
  }

  try {
    let profile = await getProfile(sessionId) || { sessionId };

    // Call AI
    const aiResponse = await processChatWithAI(message, profile, history);

    // Update Profile via resilient store
    if (aiResponse.profile_update && Object.keys(aiResponse.profile_update).length > 0) {
      await updateProfile(sessionId, aiResponse.profile_update);
      profile = await getProfile(sessionId);
    }

    // Generate real-time recommendations if profile is fairly complete
    let recommendations: any[] = [];
    let gaps: string[] = [];

    if (profile?.income_level || profile?.investment_experience || profile?.risk_level) {
      recommendations = generateRecommendations(profile!);
      gaps = detectFinancialGaps(profile!);
    }

    const isProfileComplete = !!(
      profile?.income_level &&
      profile?.investment_experience &&
      profile?.risk_level &&
      profile?.goals && profile.goals.length > 0 &&
      profile?.interests && profile.interests.length > 0
    );

    res.json({
      ...aiResponse,
      recommendations,
      financial_gaps: gaps,
      updatedProfile: profile,
      isProfileComplete
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
