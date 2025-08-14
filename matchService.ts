import { db } from "../db";
import { roleModels, userEiqScores, matchesCache, matchConfig, type RoleModel } from "@shared/schema/roleModels";
import { sql, eq, and, desc } from "drizzle-orm";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const DIM = Number(process.env.EMBEDDING_DIM) || 1536;

type Scores = { strategic: number; technical: number; creative: number; social: number };
type Match = { 
  id: string; 
  name: string; 
  domain: string; 
  region: string;
  bio?: string;
  imageUrl?: string; 
  matchScore: number; 
  matchReason: string;
  attributes?: any;
};

function cosine(a: number[], b: number[]): number {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const na = Math.hypot(...a), nb = Math.hypot(...b);
  return na && nb ? dot / (na * nb) : 0;
}

function reasonFromOverlap(user: Scores, rm: RoleModel): string {
  const dims = ["strategic", "technical", "creative", "social"] as const;
  const userScores = [user.strategic, user.technical, user.creative, user.social];
  const rmScores = [rm.strategicIQ ?? 50, rm.technicalIQ ?? 50, rm.creativeIQ ?? 50, rm.socialIQ ?? 50];
  
  // Find strongest alignments
  const deltas = dims.map((d, i) => ({ 
    dim: d, 
    delta: Math.abs(userScores[i] - rmScores[i]),
    userScore: userScores[i],
    rmScore: rmScores[i]
  }));
  deltas.sort((a, b) => a.delta - b.delta);
  
  const top = deltas.slice(0, 2);
  const strengths = top.filter(t => t.delta < 15).map(t => t.dim);
  
  if (strengths.length >= 2) {
    return `Strong alignment on ${strengths.join(" & ")} intelligence`;
  } else if (strengths.length === 1) {
    return `Excellent match in ${strengths[0]} capabilities`;
  } else {
    return `Balanced profile with complementary strengths`;
  }
}

export async function matchRules(userId: string): Promise<Match[]> {
  const [userScore] = await db.select().from(userEiqScores).where(eq(userEiqScores.userId, userId));
  if (!userScore) throw new Error("EiQ profile not found for user");
  
  const userVec = [userScore.strategic, userScore.technical, userScore.creative, userScore.social].map(Number);
  const rms = await db.select().from(roleModels);
  
  const scored = rms.map(rm => {
    const rmVec = [rm.strategicIQ ?? 50, rm.technicalIQ ?? 50, rm.creativeIQ ?? 50, rm.socialIQ ?? 50];
    const score = (cosine(userVec, rmVec) + 1) / 2; // Normalize to 0..1
    
    return {
      id: rm.id,
      name: rm.name,
      domain: rm.domain,
      region: rm.region,
      bio: rm.bio || undefined,
      imageUrl: rm.imageUrl || undefined,
      attributes: rm.attributes,
      matchScore: Math.round(score * 100), // Convert to percentage
      matchReason: reasonFromOverlap(userScore, rm)
    };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  
  // Cache results
  await cacheMatches(userId, 'rules', scored);
  
  return scored;
}

async function ensureUserEmbedding(userScore: any): Promise<number[]> {
  if (userScore.embedding) {
    try {
      const parsed = JSON.parse(userScore.embedding);
      if (Array.isArray(parsed) && parsed.length === DIM) {
        return parsed;
      }
    } catch (e) {
      // Invalid embedding, regenerate
    }
  }
  
  if (!openai) throw new Error("OpenAI not configured for ML mode");
  
  const text = `User profile: Strategic IQ ${userScore.strategic}, Technical IQ ${userScore.technical}, Creative IQ ${userScore.creative}, Social IQ ${userScore.social}. Looking for leadership role models in technology, business, and innovation.`;
  
  const res = await openai.embeddings.create({ 
    model: "text-embedding-3-small", 
    input: text 
  });
  
  const embedding = res.data[0].embedding;
  
  // Persist embedding
  await db.update(userEiqScores)
    .set({ embedding: JSON.stringify(embedding) })
    .where(eq(userEiqScores.userId, userScore.userId));
  
  return embedding;
}

export async function matchML(userId: string): Promise<Match[]> {
  try {
    const [userScore] = await db.select().from(userEiqScores).where(eq(userEiqScores.userId, userId));
    if (!userScore) throw new Error("EiQ profile not found");
    
    const userEmbedding = await ensureUserEmbedding(userScore);
    const rms = await db.select().from(roleModels);
    
    // Calculate similarity scores
    const scored = rms.map(rm => {
      let similarity = 0.5; // Default if no embedding
      
      if (rm.profileVector) {
        try {
          const rmEmbedding = JSON.parse(rm.profileVector);
          if (Array.isArray(rmEmbedding) && rmEmbedding.length === DIM) {
            similarity = (cosine(userEmbedding, rmEmbedding) + 1) / 2;
          }
        } catch (e) {
          console.error(`Invalid embedding for role model ${rm.id}`);
        }
      }
      
      return {
        id: rm.id,
        name: rm.name,
        domain: rm.domain,
        region: rm.region,
        bio: rm.bio || undefined,
        imageUrl: rm.imageUrl || undefined,
        attributes: rm.attributes,
        matchScore: Math.round(similarity * 100),
        matchReason: generateMLReason(userScore, rm, similarity)
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
    
    // Cache results
    await cacheMatches(userId, 'ml', scored);
    
    return scored;
  } catch (error) {
    console.error("ML matching failed, falling back to rules:", error);
    return matchRules(userId);
  }
}

function generateMLReason(userScore: any, rm: RoleModel, similarity: number): string {
  if (similarity > 0.9) {
    return `Exceptional cognitive alignment with ${rm.domain} leadership style`;
  } else if (similarity > 0.8) {
    return `Strong intellectual compatibility in ${rm.domain} domain`;
  } else if (similarity > 0.7) {
    return `Good match for ${rm.region} ${rm.domain} career path`;
  } else {
    return reasonFromOverlap(userScore, rm);
  }
}

async function cacheMatches(userId: string, mode: 'ml' | 'rules', matches: Match[]): Promise<void> {
  // Clear existing cache for this user and mode
  await db.delete(matchesCache).where(
    and(
      eq(matchesCache.userId, userId),
      eq(matchesCache.mode, mode)
    )
  );
  
  // Insert new cache entries
  if (matches.length > 0) {
    await db.insert(matchesCache).values(
      matches.slice(0, 3).map((match, index) => ({
        userId,
        mode,
        rank: index + 1,
        roleModelId: match.id,
        score: match.matchScore / 100,
        reason: match.matchReason
      }))
    );
  }
}

export async function getMatchMode(): Promise<'ml' | 'rules'> {
  const [config] = await db.select().from(matchConfig).where(eq(matchConfig.id, 1));
  return (config?.algorithm || process.env.MATCH_ALGORITHM_MODE || 'ml') as 'ml' | 'rules';
}

export async function setMatchMode(mode: 'ml' | 'rules'): Promise<void> {
  await db.insert(matchConfig)
    .values({ id: 1, algorithm: mode })
    .onConflictDoUpdate({
      target: matchConfig.id,
      set: { algorithm: mode, updatedAt: new Date() }
    });
}

export async function findMatches(userId: string): Promise<Match[]> {
  const mode = await getMatchMode();
  
  // Check cache first
  const cached = await db.select({
    roleModel: roleModels,
    cache: matchesCache
  })
  .from(matchesCache)
  .innerJoin(roleModels, eq(matchesCache.roleModelId, roleModels.id))
  .where(
    and(
      eq(matchesCache.userId, userId),
      eq(matchesCache.mode, mode)
    )
  )
  .orderBy(matchesCache.rank);
  
  if (cached.length >= 3) {
    return cached.map(c => ({
      id: c.roleModel.id,
      name: c.roleModel.name,
      domain: c.roleModel.domain,
      region: c.roleModel.region,
      bio: c.roleModel.bio || undefined,
      imageUrl: c.roleModel.imageUrl || undefined,
      attributes: c.roleModel.attributes,
      matchScore: Math.round(c.cache.score * 100),
      matchReason: c.cache.reason || ''
    }));
  }
  
  // Generate new matches
  return mode === 'ml' ? matchML(userId) : matchRules(userId);
}