import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Wand2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();

  // Load blog posts from database on component mount
  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = data?.map(post => ({
        id: parseInt(post.id),
        title: post.title,
        excerpt: post.excerpt,
        date: new Date(post.created_at).toISOString().split('T')[0],
        readTime: post.read_time,
        category: post.category,
        content: post.content,
      })) || [];

      onUpdatePosts(formattedPosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  };

  const saveBlogPost = async (blogPost: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: blogPost.title,
          excerpt: blogPost.excerpt,
          content: blogPost.content,
          read_time: blogPost.readTime,
          category: blogPost.category,
          user_id: (await supabase.auth.getUser()).data.user?.id || ''
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving blog post:', error);
      throw error;
    }
  };

  const generateContent = async (prompt: string, category: string = 'Technology Leadership') => {
    const { data, error } = await supabase.functions.invoke('generate-blog-content', {
      body: { prompt, category }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const handleGenerateArticle = async () => {
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
      const category = "Technology Leadership";
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

      // Save to database and update local state
      await saveBlogPost(newPost);
      await loadBlogPosts(); // Reload from database to get the latest posts

      toast({
        title: "Article Generated",
        description: "New blog article has been created and saved!",
      });

      setCustomPrompt('');
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate article. Please make sure your OpenAI API key is configured in Supabase secrets.",
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
      "Strategic partnerships in fintech: Lessons from Top Global Telecom and Fintech Firm collaboration",
      "Implementing ITIL frameworks in semiconductor manufacturing environments",
      "The role of AI in disaster recovery and business continuity planning",
      "Scaling international education programs through technology platforms",
      "Next-generation trading algorithms and market prediction models",
      "Digital transformation leadership: From strategy to execution"
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setCustomPrompt(randomTopic);
    
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

      // Save to database and update local state
      await saveBlogPost(newPost);
      await loadBlogPosts(); // Reload from database to get the latest posts

      toast({
        title: "Random Article Generated",
        description: "A new random blog article has been created and saved!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate article. Please make sure your OpenAI API key is configured in Supabase secrets.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Blog Content Manager</h3>
      
      <div className="space-y-4 mb-6">
        <p className="text-sm text-muted-foreground">
          AI-powered blog generation using secure OpenAI integration via Supabase Edge Functions.
        </p>
        
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Calendar className="w-4 h-4 text-primary" />
          <div className="text-sm">
            <strong className="text-foreground">Automatic Generation:</strong>
            <span className="text-muted-foreground ml-1">
              New articles generated every Monday at 9 AM based on your profile
            </span>
          </div>
        </div>
      </div>

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