import { Router } from "express";
import { getProfile } from "../services/dbStore";
import { generateRecommendations, detectFinancialGaps } from "../services/recommendationEngine";

const router = Router();

router.get("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const rawProfile = await getProfile(sessionId);
    if (!rawProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    // 🛡️ Always generate FRESH recommendations with the latest ET URLs
    // De-structure to remove any 'recommendations' that might exist in the profile object
    const { recommendations: oldRecs, ...profile } = rawProfile;
    
    const freshRecommendations = generateRecommendations(profile);
    const gaps = detectFinancialGaps(profile);
    
    res.json({
      ...profile,
      recommendations: freshRecommendations,
      financial_gaps: gaps
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
