import { Router } from "express";
import { storage } from "../storage";
import { 
  insertCustomQuestionSchema,
  insertCustomQuestionResponseSchema,
  insertAiQuestionSessionSchema,
  insertQuestionAssignmentSchema
} from "@shared/schema";
import { CustomQuestionGenerator } from "../ai/customQuestionGenerator";

const router = Router();
const questionGenerator = new CustomQuestionGenerator();

// Get assigned students for staff member
router.get("/assigned-students", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const students = await storage.getStaffAssignedStudents(req.user.id);
    res.json(students);
  } catch (error) {
    console.error("Error fetching assigned students:", error);
    res.status(500).json({ error: "Failed to fetch assigned students" });
  }
});

// Get staff observations
router.get("/observations", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const observations = await storage.getStaffObservations(req.user.id);
    res.json(observations);
  } catch (error) {
    console.error("Error fetching observations:", error);
    res.status(500).json({ error: "Failed to fetch observations" });
  }
});

// Create staff observation
router.post("/observations", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const observation = await storage.createStaffObservation({
      ...req.body,
      staffId: req.user.id
    });
    
    res.status(201).json(observation);
  } catch (error) {
    console.error("Error creating observation:", error);
    res.status(500).json({ error: "Failed to create observation" });
  }
});

// Get student analytics
router.get("/student-analytics/:studentId", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const analytics = await storage.getStudentProgressAnalytics(req.params.studentId);
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching student analytics:", error);
    res.status(500).json({ error: "Failed to fetch student analytics" });
  }
});

// Custom Questions System Routes

// Create custom question with AI assistance
router.post("/custom-questions", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const questionData = {
      ...req.body,
      staffId: req.user.id,
      status: 'draft'
    };

    const question = await storage.createCustomQuestion(questionData);
    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating custom question:", error);
    res.status(500).json({ error: "Failed to create custom question" });
  }
});

// Get custom questions created by staff
router.get("/custom-questions", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const questions = await storage.getCustomQuestionsByStaff(req.user.id);
    res.json(questions);
  } catch (error) {
    console.error("Error fetching custom questions:", error);
    res.status(500).json({ error: "Failed to fetch custom questions" });
  }
});

// Get specific custom question
router.get("/custom-questions/:id", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const question = await storage.getCustomQuestion(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Verify staff owns this question
    if (question.staffId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(question);
  } catch (error) {
    console.error("Error fetching custom question:", error);
    res.status(500).json({ error: "Failed to fetch custom question" });
  }
});

// Update custom question
router.put("/custom-questions/:id", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const question = await storage.getCustomQuestion(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (question.staffId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updated = await storage.updateCustomQuestion(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating custom question:", error);
    res.status(500).json({ error: "Failed to update custom question" });
  }
});

// Delete custom question
router.delete("/custom-questions/:id", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const question = await storage.getCustomQuestion(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (question.staffId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await storage.deleteCustomQuestion(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting custom question:", error);
    res.status(500).json({ error: "Failed to delete custom question" });
  }
});

// AI Question Generation Routes

// Analyze student assessment data for weaknesses
router.post("/ai-questions/analyze-student", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const { assessmentData } = req.body;
    
    if (!assessmentData) {
      return res.status(400).json({ error: "Assessment data required" });
    }

    const weaknessAnalysis = await questionGenerator.analyzeStudentWeaknesses(assessmentData);
    res.json(weaknessAnalysis);
  } catch (error) {
    console.error("Error analyzing student weaknesses:", error);
    res.status(500).json({ error: "Failed to analyze student weaknesses" });
  }
});

// Generate AI question suggestions
router.post("/ai-questions/generate", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const { 
      weaknessAnalysis, 
      questionType = 'multiple_choice', 
      difficultyTarget = 500, 
      aiProvider = 'anthropic' 
    } = req.body;

    if (!weaknessAnalysis) {
      return res.status(400).json({ error: "Weakness analysis required" });
    }

    const suggestions = await questionGenerator.generateQuestionSuggestions(
      weaknessAnalysis,
      questionType,
      difficultyTarget,
      aiProvider
    );

    // Create AI session to track this generation
    const session = await storage.createAiQuestionSession({
      staffId: req.user.id,
      aiProviderUsed: aiProvider,
      generatedQuestions: JSON.stringify(suggestions),
      sessionMetadata: JSON.stringify({
        questionType,
        difficultyTarget,
        prompt: `Generate ${questionType} questions for difficulty ${difficultyTarget}`,
        status: 'completed'
      })
    });

    res.json({ suggestions, sessionId: session.id });
  } catch (error) {
    console.error("Error generating AI questions:", error);
    res.status(500).json({ error: "Failed to generate AI questions" });
  }
});

// Refine question with AI feedback
router.post("/ai-questions/refine", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const { originalQuestion, staffFeedback, aiProvider = 'anthropic' } = req.body;

    if (!originalQuestion || !staffFeedback) {
      return res.status(400).json({ error: "Original question and staff feedback required" });
    }

    const refinedQuestion = await questionGenerator.refineQuestionWithFeedback(
      originalQuestion,
      staffFeedback,
      aiProvider
    );

    // Create AI session for refinement tracking
    const session = await storage.createAiQuestionSession({
      staffId: req.user.id,
      aiProviderUsed: aiProvider,
      generatedQuestions: JSON.stringify(refinedQuestion),
      sessionMetadata: JSON.stringify({
        originalQuestion,
        staffFeedback,
        prompt: `Refine question based on feedback: ${staffFeedback}`,
        status: 'completed'
      })
    });

    res.json({ refinedQuestion, sessionId: session.id });
  } catch (error) {
    console.error("Error refining question:", error);
    res.status(500).json({ error: "Failed to refine question" });
  }
});

// Estimate question difficulty
router.post("/ai-questions/estimate-difficulty", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const { questionContent } = req.body;

    if (!questionContent) {
      return res.status(400).json({ error: "Question content required" });
    }

    const difficultyEstimate = await questionGenerator.estimateQuestionDifficulty(questionContent);
    res.json(difficultyEstimate);
  } catch (error) {
    console.error("Error estimating question difficulty:", error);
    res.status(500).json({ error: "Failed to estimate question difficulty" });
  }
});

// Question Assignment Routes

// Assign question to student
router.post("/question-assignments", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const assignmentData = {
      ...req.body,
      staffId: req.user.id,
      assignedAt: new Date(),
      status: 'assigned'
    };

    const assignment = await storage.createQuestionAssignment(assignmentData);
    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating question assignment:", error);
    res.status(500).json({ error: "Failed to create question assignment" });
  }
});

// Get staff's question assignments
router.get("/question-assignments", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const assignments = await storage.getStaffQuestionAssignments(req.user.id);
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching question assignments:", error);
    res.status(500).json({ error: "Failed to fetch question assignments" });
  }
});

// Update question assignment
router.put("/question-assignments/:id", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const assignment = await storage.getQuestionAssignment(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    if (assignment.staffId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updated = await storage.updateQuestionAssignment(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating question assignment:", error);
    res.status(500).json({ error: "Failed to update question assignment" });
  }
});

// Get responses to custom questions
router.get("/custom-questions/:questionId/responses", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    // Verify staff owns the question
    const question = await storage.getCustomQuestion(req.params.questionId);
    if (!question || question.staffId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const responses = await storage.getCustomQuestionResponses(req.params.questionId);
    res.json(responses);
  } catch (error) {
    console.error("Error fetching question responses:", error);
    res.status(500).json({ error: "Failed to fetch question responses" });
  }
});

// Get AI question sessions
router.get("/ai-sessions", async (req: any, res) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Staff access required" });
    }

    const sessions = await storage.getAiQuestionSessions(req.user.id);
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching AI sessions:", error);
    res.status(500).json({ error: "Failed to fetch AI sessions" });
  }
});

export default router;