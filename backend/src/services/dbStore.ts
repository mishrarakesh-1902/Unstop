import UserProfile from "../models/UserProfile";

// 🏆 HACKATHON SAFETY MEMORY STORE
// This handles situations where MongoDB Atlas blocks the user's IP.
// If Mongo is down, we store profile data in RAM so the demo never crashes!
const memoryStore: Record<string, any> = {};

export const getProfile = async (sessionId: string) => {
  try {
    // 1. Try Mongo
    const profile = await UserProfile.findOne({ sessionId });
    if (profile) return profile.toObject();
  } catch (err) {
    console.log(`[SAFE MODE] MongoDB connection failed. Using memory fallback for session ${sessionId}`);
  }

  // 2. Fallback to Memory
  return memoryStore[sessionId] || null;
};

export const updateProfile = async (sessionId: string, updateData: any) => {
  try {
    // 1. Try Mongo
    await UserProfile.updateOne({ sessionId }, { $set: updateData }, { upsert: true });
    return;
  } catch (err) {
    // 2. Fallback to Memory
    console.log(`[SAFE MODE] Saving data to RAM for session ${sessionId}`);
    const current = memoryStore[sessionId] || { sessionId };
    memoryStore[sessionId] = { ...current, ...updateData, lastUpdated: new Date() };
  }
};
