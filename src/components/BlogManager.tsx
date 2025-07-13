import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Key, Wand2, Save } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

interface BlogManagerProps {
  onUpdatePosts: (posts: BlogPost[]) => void;
  currentPosts: BlogPost[];
}

export function BlogManager({ onUpdatePosts, currentPosts }: BlogManagerProps) {
  const [apiKey, setApiKey] = useState(() => 
    localStorage.getItem('openai-api-key') || ''
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai-api-key', apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved securely in your browser.",
      });
    }
  };

  const generateContent = async (prompt: string, category: string) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are Christopher Taylor, a senior technology executive with 25+ years of experience in digital transformation, AI strategy, and enterprise architecture. You're currently Co-Founder & CTO of The Sikat Agency and Acting CTO/CDO of ID Future Stars. Your expertise spans trading platforms (risc.ai), education technology, and strategic partnerships with companies like Globe Telecom (GCash). Write in a professional, insightful tone that demonstrates deep technical and business knowledge.`
          },
          {
            role: 'user',
            content: `Write a comprehensive blog post about: ${prompt}. 

Category: ${category}

The blog post should:
- Be 1000-1500 words
- Include specific technical details and business insights
- Reference your experience and current projects when relevant
- Include actionable insights for executives and technical leaders
- Use markdown formatting with proper headers
- End with a call to action for potential collaborations

Format the response as a JSON object with:
{
  "title": "Blog post title",
  "excerpt": "2-3 sentence summary",
  "content": "Full markdown content",
  "readTime": "X min read"
}`
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  };

  const handleGenerateArticle = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter and save your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    if (!customPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a topic or prompt for the article.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const category = "Technology Leadership"; // Default category
      const generatedContent = await generateContent(customPrompt, category);
      
      const newPost: BlogPost = {
        id: Date.now(),
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        date: new Date().toISOString().split('T')[0],
        readTime: generatedContent.readTime,
        category,
        content: generatedContent.content,
      };

      const updatedPosts = [newPost, ...currentPosts];
      onUpdatePosts(updatedPosts);

      toast({
        title: "Article Generated",
        description: "New blog article has been created successfully!",
      });

      setCustomPrompt('');
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate article. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRandomArticle = async () => {
    const topics = [
      "The future of AI in enterprise automation and its impact on digital transformation strategies",
      "Building resilient cloud architectures for global financial services companies",
      "How predictive analytics is reshaping currency trading and risk management",
      "The evolution of education technology and AI-powered learning platforms",
      "Strategic partnerships in fintech: Lessons from Globe Telecom and GCash collaboration",
      "Implementing ITIL frameworks in semiconductor manufacturing environments",
      "The role of AI in disaster recovery and business continuity planning",
      "Scaling international education programs through technology platforms",
      "Next-generation trading algorithms and market prediction models",
      "Digital transformation leadership: From strategy to execution"
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setCustomPrompt(randomTopic);
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter and save your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const category = "Technology Leadership";
      const generatedContent = await generateContent(randomTopic, category);
      
      const newPost: BlogPost = {
        id: Date.now(),
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        date: new Date().toISOString().split('T')[0],
        readTime: generatedContent.readTime,
        category,
        content: generatedContent.content,
      };

      const updatedPosts = [newPost, ...currentPosts];
      onUpdatePosts(updatedPosts);

      toast({
        title: "Random Article Generated",
        description: "A new random blog article has been created!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate article. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Blog Content Manager</h3>
      
      {/* API Key Section */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={saveApiKey} size="sm">
            <Key className="w-4 h-4 mr-2" />
            Save Key
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Your API key is stored securely in your browser and never sent to our servers.
        </p>
      </div>

      {/* Content Generation */}
      <div className="space-y-4">
        <Textarea
          placeholder="Enter a topic or prompt for a new blog article (e.g., 'AI trends in fintech', 'Digital transformation case studies', etc.)"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={3}
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateArticle}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Article'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={generateRandomArticle}
            disabled={isGenerating}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Random Topic
          </Button>
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <strong>Current articles:</strong> {currentPosts.length} | 
        Generate new content automatically with AI-powered writing
      </div>
    </Card>
  );
}