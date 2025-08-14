/**
 * Interactive AI Mentor for Onboarding Flow
 * EiQ™powered by SikatLabsAI™ and IDFS Pathway™
 */

import { aiProviderCall } from "../ai-providers";

export interface MentorPersonality {
  name: string;
  description: string;
  systemPrompt: string;
  greetingStyle: string;
}

export const mentorPersonalities: Record<string, MentorPersonality> = {
  supportive: {
    name: "Alex (Supportive Guide)",
    description: "Encouraging and patient, perfect for building confidence",
    systemPrompt: `You are Alex, a supportive and encouraging AI mentor for the EiQ™ platform. Your personality is:
    - Warm, patient, and understanding
    - Always finds positive aspects in what students share
    - Uses encouraging language like "That's wonderful!" and "I can see you're thoughtful about..."
    - Asks gentle, open-ended questions to learn more
    - Celebrates small wins and progress
    - Makes learning feel safe and enjoyable
    
    Keep responses to 2-3 sentences max. Be conversational and personal.`,
    greetingStyle: "Hi there! I'm Alex, your supportive learning mentor. I'm here to help make your educational journey as smooth and encouraging as possible. What excites you most about learning?"
  },
  
  challenging: {
    name: "Dr. Chen (Academic Challenger)",
    description: "Intellectually stimulating mentor who pushes for excellence",
    systemPrompt: `You are Dr. Chen, an academically rigorous AI mentor for the EiQ™ platform. Your personality is:
    - Intellectually curious and thought-provoking
    - Asks "why" and "how" questions to deepen thinking
    - Sets high expectations while remaining supportive
    - Uses academic language but stays accessible
    - Challenges assumptions and encourages critical thinking
    - Focuses on growth through intellectual challenge
    
    Keep responses to 2-3 sentences max. Be professional but engaging.`,
    greetingStyle: "Greetings! I'm Dr. Chen, and I'll be challenging you to reach your full academic potential. I believe in pushing boundaries - what's the most challenging concept you've ever mastered?"
  },
  
  friendly: {
    name: "Sam (Friendly Companion)",
    description: "Casual and relatable, like chatting with a study buddy",
    systemPrompt: `You are Sam, a friendly and casual AI mentor for the EiQ™ platform. Your personality is:
    - Casual, conversational, and relatable
    - Uses informal language like "Hey!" and "That's awesome!"
    - Shares excitement about learning and discovery
    - Makes complex topics feel approachable
    - Acts like a knowledgeable friend, not a teacher
    - Uses humor and enthusiasm appropriately
    
    Keep responses to 2-3 sentences max. Be casual but helpful.`,
    greetingStyle: "Hey! I'm Sam, and I'm super excited to be your learning buddy! Think of me as that friend who actually enjoyed school - what's something cool you're hoping to learn?"
  },
  
  professional: {
    name: "Jordan (EiQ Score Coach)",
    description: "Educational mentor focused on EiQ score improvement and cognitive development",
    systemPrompt: `You are Jordan, an education-focused AI mentor for the EiQ™ platform specializing in cognitive development and EiQ score improvement. Your personality is:
    - Educational, analytical, and improvement-oriented
    - Connects learning to EiQ score enhancement and cognitive development
    - Discusses educational strategies and skill-building techniques
    - Uses educational/psychological terminology appropriately
    - Focuses on cognitive abilities, problem-solving skills, and academic excellence
    - Balances challenge with achievable learning goals
    
    Always focus on education, learning, and EiQ score improvement - never career paths. Keep responses to 2-3 sentences max. Be educational but approachable.`,
    greetingStyle: "Hello, I'm Jordan, your EiQ improvement coach. I'm here to help you enhance your cognitive abilities and boost your EiQ score through targeted educational strategies. What area of learning would you like to strengthen first?"
  }
};

export interface ConversationContext {
  userAge?: number;
  educationalLevel?: string;
  gradeLevel?: string;
  currentStep?: number;
  userResponses?: Record<string, any>;
  previousInsights?: string[];
}

export class InteractiveAiMentor {
  private personality: MentorPersonality;
  private conversationHistory: Array<{role: 'user' | 'assistant', content: string, timestamp: Date}> = [];

  constructor(personalityType: string = 'supportive') {
    this.personality = mentorPersonalities[personalityType] || mentorPersonalities.supportive;
  }

  async generatePersonalizedGreeting(context: ConversationContext): Promise<string> {
    const ageAppropriate = context.userAge && context.userAge < 18 ? 
      "Remember, I'm here to support your learning journey in age-appropriate ways." : "";
    
    const contextualGreeting = `${this.personality.greetingStyle} ${ageAppropriate}`.trim();
    
    // Generate a more personalized greeting based on context
    const prompt = `${this.personality.systemPrompt}

Context: User is ${context.educationalLevel || 'starting their journey'}, ${context.userAge ? `age ${context.userAge}` : ''}.

Generate a personalized greeting that:
1. Introduces yourself as ${this.personality.name}
2. Shows enthusiasm about their educational journey
3. Is appropriate for their age/level
4. Ends with an engaging question to start conversation

Keep it warm, concise (2-3 sentences), and engaging.`;

    try {
      const response = await aiProviderCall('anthropic', prompt);
      
      const greeting = response || contextualGreeting;
      this.addToConversation('assistant', greeting);
      return greeting;
      
    } catch (error) {
      console.error('AI Mentor greeting generation failed:', error);
      return contextualGreeting;
    }
  }

  async generateResponse(userMessage: string, context: ConversationContext): Promise<{
    response: string;
    insights: string[];
    suggestions: string[];
  }> {
    this.addToConversation('user', userMessage);

    const prompt = `${this.personality.systemPrompt}

Current Context:
- Educational Level: ${context.educationalLevel || 'Unknown'}
- Age: ${context.userAge || 'Unknown'}
- Current Onboarding Step: ${context.currentStep || 1}
- Previous responses: ${JSON.stringify(context.userResponses || {})}

User just said: "${userMessage}"

Conversation History:
${this.conversationHistory.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Generate:
1. A warm, engaging response that acknowledges what they shared
2. A thoughtful follow-up question or comment
3. Keep response to 2-3 sentences max
4. Stay in character as ${this.personality.name}

Respond in JSON format:
{
  "response": "Your conversational response",
  "insights": ["Key insight about user", "Another insight"],
  "suggestions": ["Adaptive suggestion", "Learning recommendation"]
}`;

    try {
      const aiResponse = await aiProviderCall('anthropic', prompt);
      
      const parsedResponse = JSON.parse(aiResponse || '{}');
      const response = parsedResponse.response || "That's interesting! Tell me more about that.";
      
      this.addToConversation('assistant', response);
      
      return {
        response,
        insights: parsedResponse.insights || [],
        suggestions: parsedResponse.suggestions || []
      };
      
    } catch (error) {
      console.error('AI Mentor response generation failed:', error);
      const fallbackResponse = "I find that fascinating! Could you share more details about that?";
      this.addToConversation('assistant', fallbackResponse);
      
      return {
        response: fallbackResponse,
        insights: ["User is engaged and sharing information"],
        suggestions: ["Continue the conversation with follow-up questions"]
      };
    }
  }

  async generateStepGuidance(stepNumber: number, context: ConversationContext): Promise<string> {
    const stepGuidance = {
      1: "Let's start with understanding your educational background and current level.",
      2: "Now I'd love to learn about what subjects and topics interest you most!",
      3: "Tell me about how you prefer to learn - everyone has their own style.",
      4: "Let's discuss your goals and what you hope to achieve through learning.",
      5: "Finally, let's review everything and set up your personalized learning path!"
    };

    const basicGuidance = stepGuidance[stepNumber as keyof typeof stepGuidance] || 
                         "Let's continue with the next part of your profile setup.";

    const prompt = `${this.personality.systemPrompt}

The user is on step ${stepNumber} of onboarding. Context: ${JSON.stringify(context)}

Basic step guidance: "${basicGuidance}"

Generate a personalized transition to this step that:
1. Acknowledges progress from previous steps
2. Introduces the current step naturally
3. Shows enthusiasm and encouragement
4. Stays in character as ${this.personality.name}
5. Keep it to 2-3 sentences max

Be conversational and engaging.`;

    try {
      const response = await aiProviderCall('anthropic', prompt);
      
      return response || basicGuidance;
      
    } catch (error) {
      console.error('AI Mentor step guidance generation failed:', error);
      return basicGuidance;
    }
  }

  async generateFinalInsights(onboardingData: any): Promise<{
    summary: string;
    recommendations: string[];
    nextSteps: string[];
  }> {
    const prompt = `${this.personality.systemPrompt}

The user has completed onboarding with this data: ${JSON.stringify(onboardingData)}

As ${this.personality.name}, generate:
1. A warm, encouraging summary of what you learned about them
2. 3-4 personalized learning recommendations
3. 3-4 specific next steps for their journey

Respond in JSON format:
{
  "summary": "Your encouraging summary of their profile",
  "recommendations": ["Recommendation 1", "Recommendation 2", ...],
  "nextSteps": ["Next step 1", "Next step 2", ...]
}

Make it personal and motivating, staying in character.`;

    try {
      const response = await aiProviderCall('anthropic', prompt);
      
      const parsed = JSON.parse(response || '{}');
      
      return {
        summary: parsed.summary || "You've shared wonderful insights about your learning journey!",
        recommendations: parsed.recommendations || [
          "Start with foundational assessments",
          "Explore your areas of interest",
          "Set achievable learning goals"
        ],
        nextSteps: parsed.nextSteps || [
          "Complete your EiQ assessment",
          "Review your personalized dashboard",
          "Begin your first learning module"
        ]
      };
      
    } catch (error) {
      console.error('AI Mentor final insights generation failed:', error);
      return {
        summary: "You've provided great information about your learning goals and preferences!",
        recommendations: [
          "Begin with your EiQ assessment to establish your baseline",
          "Explore learning modules in your areas of interest",
          "Set up regular study sessions based on your preferred schedule"
        ],
        nextSteps: [
          "Complete your comprehensive EiQ assessment",
          "Review your personalized learning dashboard",
          "Start your first recommended learning pathway"
        ]
      };
    }
  }

  private addToConversation(role: 'user' | 'assistant', content: string) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    });
    
    // Keep only last 20 messages to manage memory
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  getConversationHistory() {
    return [...this.conversationHistory];
  }

  getPersonalityInfo() {
    return this.personality;
  }
}