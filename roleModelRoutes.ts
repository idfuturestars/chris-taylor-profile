import { Router } from "express";
import { db } from "../db";
import { roleModels, roleModelMilestones, userEiqScores, matchConfig } from "@shared/schema/roleModels";
import { findMatches, setMatchMode, getMatchMode } from "../services/matchService";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "../replitAuth";

const router = Router();

// Get user's top 3 role model matches
router.get("/api/role-models/matches", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Ensure user has EiQ scores
    const [userScore] = await db.select().from(userEiqScores).where(eq(userEiqScores.userId, userId));
    if (!userScore) {
      // Create default scores if not exists
      await db.insert(userEiqScores).values({
        userId,
        strategic: 70,
        technical: 75,
        creative: 80,
        social: 72
      });
    }

    const matches = await findMatches(userId);
    res.json({ matches });
  } catch (error) {
    console.error("Error finding matches:", error);
    res.status(500).json({ error: "Failed to find role model matches" });
  }
});

// Get specific role model details with milestones
router.get("/api/role-models/:id", isAuthenticated, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const [roleModel] = await db.select().from(roleModels).where(eq(roleModels.id, id));
    if (!roleModel) {
      return res.status(404).json({ error: "Role model not found" });
    }

    const milestones = await db.select()
      .from(roleModelMilestones)
      .where(eq(roleModelMilestones.roleModelId, id))
      .orderBy(roleModelMilestones.orderIndex);

    res.json({ roleModel, milestones });
  } catch (error) {
    console.error("Error fetching role model:", error);
    res.status(500).json({ error: "Failed to fetch role model details" });
  }
});

// Get "Path to X" analysis
router.get("/api/role-models/:id/path", isAuthenticated, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.claims?.sub;

    const [roleModel] = await db.select().from(roleModels).where(eq(roleModels.id, id));
    if (!roleModel) {
      return res.status(404).json({ error: "Role model not found" });
    }

    const [userScore] = await db.select().from(userEiqScores).where(eq(userEiqScores.userId, userId));
    if (!userScore) {
      return res.status(404).json({ error: "User EiQ profile not found" });
    }

    const milestones = await db.select()
      .from(roleModelMilestones)
      .where(eq(roleModelMilestones.roleModelId, id))
      .orderBy(roleModelMilestones.orderIndex);

    // Calculate gaps
    const gaps = {
      strategic: (roleModel.strategicIQ || 50) - userScore.strategic,
      technical: (roleModel.technicalIQ || 50) - userScore.technical,
      creative: (roleModel.creativeIQ || 50) - userScore.creative,
      social: (roleModel.socialIQ || 50) - userScore.social
    };

    // Generate recommendations
    const recommendations = [];
    if (gaps.strategic > 10) {
      recommendations.push({
        area: "Strategic Thinking",
        gap: gaps.strategic,
        actions: ["Study business strategy frameworks", "Practice case studies", "Join strategy consulting clubs"]
      });
    }
    if (gaps.technical > 10) {
      recommendations.push({
        area: "Technical Skills",
        gap: gaps.technical,
        actions: ["Complete coding bootcamps", "Build technical projects", "Contribute to open source"]
      });
    }
    if (gaps.creative > 10) {
      recommendations.push({
        area: "Creative Problem Solving",
        gap: gaps.creative,
        actions: ["Practice design thinking", "Join innovation workshops", "Start creative side projects"]
      });
    }
    if (gaps.social > 10) {
      recommendations.push({
        area: "Social Intelligence",
        gap: gaps.social,
        actions: ["Practice public speaking", "Lead team projects", "Join networking events"]
      });
    }

    res.json({
      roleModel,
      milestones,
      currentProfile: userScore,
      gaps,
      recommendations
    });
  } catch (error) {
    console.error("Error generating path:", error);
    res.status(500).json({ error: "Failed to generate career path" });
  }
});

// Admin: Get/Set matching algorithm mode
router.get("/api/admin/match-config", isAuthenticated, async (req: any, res) => {
  try {
    const mode = await getMatchMode();
    res.json({ mode });
  } catch (error) {
    console.error("Error getting match config:", error);
    res.status(500).json({ error: "Failed to get match configuration" });
  }
});

router.post("/api/admin/match-config", isAuthenticated, async (req: any, res) => {
  try {
    const { mode } = req.body;
    if (!['ml', 'rules'].includes(mode)) {
      return res.status(400).json({ error: "Invalid mode. Must be 'ml' or 'rules'" });
    }

    await setMatchMode(mode as 'ml' | 'rules');
    res.json({ success: true, mode });
  } catch (error) {
    console.error("Error setting match config:", error);
    res.status(500).json({ error: "Failed to update match configuration" });
  }
});

// Admin: Get matching analytics
router.get("/api/admin/match-analytics", isAuthenticated, async (req: any, res) => {
  try {
    // Get distribution of matches by domain and region
    const allRoleModels = await db.select().from(roleModels);
    
    const domainDistribution = allRoleModels.reduce((acc, rm) => {
      acc[rm.domain] = (acc[rm.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const regionDistribution = allRoleModels.reduce((acc, rm) => {
      acc[rm.region] = (acc[rm.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const currentMode = await getMatchMode();

    res.json({
      totalRoleModels: allRoleModels.length,
      currentMode,
      domainDistribution,
      regionDistribution
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch match analytics" });
  }
});

export default router;