import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { aiProvider } from "../ai-providers";
import { z } from "zod";

const router = Router();

// Schema validation
const createSessionSchema = z.object({
  title: z.string().min(1).max(200)
});

const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  role: z.enum(['user', 'assistant', 'system'])
});

// Get chat sessions for user
router.get('/sessions', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const sessions = await storage.getChatSessions(userId);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ message: "Failed to fetch chat sessions" });
  }
});

// Create new chat session
router.post('/sessions', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title } = createSessionSchema.parse(req.body);
    
    const session = await storage.createChatSession({
      userId,
      title
    });

    res.status(201).json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error('Error creating chat session:', error);
    res.status(500).json({ message: "Failed to create chat session" });
  }
});

// Get messages for a session
router.get('/messages/:sessionId', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { sessionId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Verify user owns the session
    const session = await storage.getChatSession(sessionId);
    if (!session || session.userId !== userId) {
      return res.status(404).json({ message: "Session not found" });
    }

    const messages = await storage.getChatMessages(sessionId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Send message to session
router.post('/sessions/:sessionId/messages', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { sessionId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { content, role } = sendMessageSchema.parse(req.body);

    // Verify user owns the session
    const session = await storage.getChatSession(sessionId);
    if (!session || session.userId !== userId) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Save user message
    const userMessage = await storage.createChatMessage({
      sessionId,
      role: 'user',
      content
    });

    // Generate AI response
    let aiResponse = "";
    let aiMetadata = {};
    
    try {
      const context = `You are EiQ™ AI Assistant, helping with educational assessments and learning. 
      The user is asking: ${content}
      
      Provide helpful, educational guidance focusing on:
      - Academic learning and improvement
      - Assessment strategies
      - Study techniques
      - Skill development
      
      Keep responses concise and actionable.`;

      aiResponse = await aiProvider.generateResponse(content);

      // Add educational suggestions based on content
      if (content.toLowerCase().includes('assessment') || content.toLowerCase().includes('test')) {
        aiMetadata = {
          suggestions: [
            "Try the baseline assessment for quick scoring",
            "Practice specific domains that need improvement",
            "Review learning materials before retesting"
          ]
        };
      } else if (content.toLowerCase().includes('learn') || content.toLowerCase().includes('study')) {
        aiMetadata = {
          suggestions: [
            "Explore personalized learning tracks",
            "Set specific learning goals",
            "Track your progress regularly"
          ]
        };
      }
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      aiResponse = "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
    }

    // Save AI response
    const aiMessage = await storage.createChatMessage({
      sessionId,
      role: 'assistant',
      content: aiResponse
    });

    // Update session message count
    await storage.updateChatSession(sessionId, {
      messageCount: session.messageCount + 2
    });

    res.json({
      userMessage,
      aiMessage
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error('Error sending message:', error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Delete chat session
router.delete('/sessions/:sessionId', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { sessionId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Verify user owns the session
    const session = await storage.getChatSession(sessionId);
    if (!session || session.userId !== userId) {
      return res.status(404).json({ message: "Session not found" });
    }

    await storage.deleteChatSession(sessionId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: "Failed to delete session" });
  }
});

export default router;