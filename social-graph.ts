// Social EIQ Cohorts API
import { Router, Request, Response } from 'express';
import { db } from '../db';
import { 
  users, 
  studyGroups, 
  studyGroupMembers
} from '@shared/schema';
import { eq, desc, and, gte, sql, count, avg } from 'drizzle-orm';

const router = Router();

// GET /api/social/cohort/members - Get cohort members with pagination
router.get('/cohort/members', async (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0, search } = req.query;
    
    let query = db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        profileImageUrl: users.profileImageUrl,
        eiqScore: users.eiqScore,
        studyStreak: users.studyStreak,
        specializations: users.specializations,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt
      })
      .from(users)
      .where(sql`${users.eiqScore} IS NOT NULL`)
      .orderBy(desc(users.eiqScore))
      .limit(Number(limit))
      .offset(Number(offset));

    if (search) {
      query = query.where(
        sql`${users.username} ILIKE ${`%${search}%`} OR ${users.displayName} ILIKE ${`%${search}%`}`
      );
    }

    const members = await query;

    // Calculate ranks and recent activity
    const enrichedMembers = await Promise.all(
      members.map(async (member, index) => {
        // Get rank based on EIQ score
        const [rankResult] = await db
          .select({ rank: sql`ROW_NUMBER() OVER (ORDER BY ${users.eiqScore} DESC)` })
          .from(users)
          .where(eq(users.id, member.id));

        // Get recent activity
        const recentActivity = await db
          .select({
            type: socialActivity.type,
            description: socialActivity.description,
            timestamp: socialActivity.createdAt
          })
          .from(socialActivity)
          .where(eq(socialActivity.userId, member.id))
          .orderBy(desc(socialActivity.createdAt))
          .limit(3);

        return {
          ...member,
          rank: rankResult?.rank || index + 1,
          recentActivity: recentActivity.map(a => a.description),
          lastActive: member.lastLoginAt 
            ? getTimeAgo(new Date(member.lastLoginAt))
            : 'Never'
        };
      })
    );

    res.json({
      members: enrichedMembers,
      total: members.length,
      hasMore: members.length === Number(limit)
    });
  } catch (error) {
    console.error('[SOCIAL] Error fetching cohort members:', error);
    res.status(500).json({ error: 'Failed to fetch cohort members' });
  }
});

// GET /api/social/study-groups - Get available study groups
router.get('/study-groups', async (req: Request, res: Response) => {
  try {
    const { userId = 'demo_user' } = req.query;
    
    // Get all study groups with member counts and average EIQ
    const groups = await db
      .select({
        id: studyGroups.id,
        name: studyGroups.name,
        description: studyGroups.description,
        category: studyGroups.category,
        weeklyGoal: studyGroups.weeklyGoal,
        memberCount: sql<number>`COUNT(${studyGroupMembers.userId})`,
        avgEiqScore: sql<number>`AVG(${users.eiqScore})`
      })
      .from(studyGroups)
      .leftJoin(studyGroupMembers, eq(studyGroups.id, studyGroupMembers.groupId))
      .leftJoin(users, eq(studyGroupMembers.userId, users.id))
      .groupBy(studyGroups.id, studyGroups.name, studyGroups.description, studyGroups.category, studyGroups.weeklyGoal);

    // Check which groups the user has joined
    const userGroups = await db
      .select({ groupId: studyGroupMembers.groupId })
      .from(studyGroupMembers)
      .where(eq(studyGroupMembers.userId, userId as string));

    const userGroupIds = new Set(userGroups.map(ug => ug.groupId));

    const enrichedGroups = groups.map(group => ({
      ...group,
      memberCount: Number(group.memberCount) || 0,
      avgEiqScore: Math.round(Number(group.avgEiqScore) || 0),
      isJoined: userGroupIds.has(group.id),
      recentDiscussions: Math.floor(Math.random() * 20) // Mock for now
    }));

    res.json({
      groups: enrichedGroups,
      total: enrichedGroups.length
    });
  } catch (error) {
    console.error('[SOCIAL] Error fetching study groups:', error);
    res.status(500).json({ error: 'Failed to fetch study groups' });
  }
});

// POST /api/social/study-groups/:groupId/join - Join a study group
router.post('/study-groups/:groupId/join', async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId = 'demo_user' } = req.body;

    // Check if already a member
    const [existingMember] = await db
      .select()
      .from(studyGroupMembers)
      .where(and(
        eq(studyGroupMembers.groupId, groupId),
        eq(studyGroupMembers.userId, userId)
      ));

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }

    // Add member to group
    await db.insert(studyGroupMembers).values({
      groupId,
      userId,
      joinedAt: new Date(),
      role: 'member'
    });

    // Log activity
    await db.insert(socialActivity).values({
      userId,
      type: 'group_join',
      description: 'Joined a study group',
      metadata: { groupId },
      createdAt: new Date()
    });

    res.json({
      success: true,
      message: 'Successfully joined study group'
    });
  } catch (error) {
    console.error('[SOCIAL] Error joining study group:', error);
    res.status(500).json({ error: 'Failed to join study group' });
  }
});

// GET /api/social/activity - Get recent cohort activity
router.get('/activity', async (req: Request, res: Response) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const activities = await db
      .select({
        id: socialActivity.id,
        type: socialActivity.type,
        description: socialActivity.description,
        userId: socialActivity.userId,
        username: users.username,
        displayName: users.displayName,
        profileImageUrl: users.profileImageUrl,
        createdAt: socialActivity.createdAt,
        eiqGain: socialActivity.eiqGain
      })
      .from(socialActivity)
      .innerJoin(users, eq(socialActivity.userId, users.id))
      .orderBy(desc(socialActivity.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    const enrichedActivities = activities.map(activity => ({
      ...activity,
      timestamp: getTimeAgo(new Date(activity.createdAt))
    }));

    res.json({
      activities: enrichedActivities,
      total: activities.length,
      hasMore: activities.length === Number(limit)
    });
  } catch (error) {
    console.error('[SOCIAL] Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// GET /api/social/challenges/active - Get active cohort challenges
router.get('/challenges/active', async (req: Request, res: Response) => {
  try {
    const { userId = 'demo_user' } = req.query;

    const challenges = await db
      .select({
        id: cohortChallenges.id,
        title: cohortChallenges.title,
        description: cohortChallenges.description,
        reward: cohortChallenges.reward,
        startDate: cohortChallenges.startDate,
        endDate: cohortChallenges.endDate,
        maxParticipants: cohortChallenges.maxParticipants,
        participantCount: sql<number>`COUNT(${challengeParticipants.userId})`
      })
      .from(cohortChallenges)
      .leftJoin(challengeParticipants, eq(cohortChallenges.id, challengeParticipants.challengeId))
      .where(and(
        gte(cohortChallenges.endDate, new Date()),
        eq(cohortChallenges.status, 'active')
      ))
      .groupBy(
        cohortChallenges.id,
        cohortChallenges.title,
        cohortChallenges.description,
        cohortChallenges.reward,
        cohortChallenges.startDate,
        cohortChallenges.endDate,
        cohortChallenges.maxParticipants
      );

    // Check user participation and get leaderboards
    const enrichedChallenges = await Promise.all(
      challenges.map(async (challenge) => {
        // Check if user is participating
        const [userParticipation] = await db
          .select()
          .from(challengeParticipants)
          .where(and(
            eq(challengeParticipants.challengeId, challenge.id),
            eq(challengeParticipants.userId, userId as string)
          ));

        // Get top 3 leaderboard
        const leaderboard = await db
          .select({
            rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${challengeParticipants.score} DESC)`,
            username: users.username,
            score: challengeParticipants.score
          })
          .from(challengeParticipants)
          .innerJoin(users, eq(challengeParticipants.userId, users.id))
          .where(eq(challengeParticipants.challengeId, challenge.id))
          .orderBy(desc(challengeParticipants.score))
          .limit(3);

        const daysLeft = Math.ceil(
          (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          ...challenge,
          participants: Number(challenge.participantCount) || 0,
          totalParticipants: challenge.maxParticipants || 1000,
          daysLeft: Math.max(0, daysLeft),
          isParticipating: !!userParticipation,
          leaderboard: leaderboard.map((entry, index) => ({
            rank: index + 1,
            username: entry.username,
            score: entry.score || 0
          }))
        };
      })
    );

    res.json({
      challenges: enrichedChallenges,
      total: enrichedChallenges.length
    });
  } catch (error) {
    console.error('[SOCIAL] Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// POST /api/social/challenges/:challengeId/join - Join a challenge
router.post('/challenges/:challengeId/join', async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const { userId = 'demo_user' } = req.body;

    // Check if already participating
    const [existingParticipation] = await db
      .select()
      .from(challengeParticipants)
      .where(and(
        eq(challengeParticipants.challengeId, challengeId),
        eq(challengeParticipants.userId, userId)
      ));

    if (existingParticipation) {
      return res.status(400).json({ error: 'Already participating in this challenge' });
    }

    // Add participant
    await db.insert(challengeParticipants).values({
      challengeId,
      userId,
      joinedAt: new Date(),
      score: 0
    });

    // Log activity
    await db.insert(socialActivity).values({
      userId,
      type: 'challenge_join',
      description: 'Joined a cohort challenge',
      metadata: { challengeId },
      createdAt: new Date()
    });

    res.json({
      success: true,
      message: 'Successfully joined challenge'
    });
  } catch (error) {
    console.error('[SOCIAL] Error joining challenge:', error);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
});

// GET /api/social/user/stats - Get user's social stats
router.get('/user/stats', async (req: Request, res: Response) => {
  try {
    const { userId = 'demo_user' } = req.query;

    // Get user's current EIQ score and rank
    const [user] = await db
      .select({
        eiqScore: users.eiqScore,
        studyStreak: users.studyStreak
      })
      .from(users)
      .where(eq(users.id, userId as string));

    // Calculate rank
    const [rankResult] = await db
      .select({ 
        rank: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE ${users.eiqScore} > ${user?.eiqScore || 0}) + 1`
      })
      .from(users);

    // Get total cohort size
    const [cohortSize] = await db
      .select({ 
        total: count(users.id)
      })
      .from(users)
      .where(sql`${users.eiqScore} IS NOT NULL`);

    res.json({
      eiqScore: user?.eiqScore || 0,
      rank: rankResult?.rank || 0,
      cohortSize: cohortSize?.total || 0,
      studyStreak: user?.studyStreak || 0
    });
  } catch (error) {
    console.error('[SOCIAL] Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Utility function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return minutes <= 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
}

export default router;