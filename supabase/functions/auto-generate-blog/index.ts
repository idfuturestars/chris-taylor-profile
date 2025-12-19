import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const profileBasedTopics = [
  "The future of AI in enterprise automation and digital transformation strategies for technology executives",
  "Building resilient cloud architectures for financial services: Lessons from trading platform development",
  "How predictive analytics is reshaping currency trading and risk management in fintech",
  "The evolution of education technology: AI-powered learning platforms and their impact on global education",
  "Strategic partnerships in fintech: Building bridges between telecom and financial services",
  "Implementing ITIL frameworks in high-tech manufacturing: A CTO's perspective on operational excellence",
  "The role of AI in disaster recovery and business continuity planning for enterprise systems",
  "Scaling international education programs through innovative technology platforms",
  "Next-generation trading algorithms: Machine learning approaches to market prediction",
  "Digital transformation leadership: From strategy to execution in complex enterprise environments",
  "Building secure API ecosystems for financial services: Architecture and best practices",
  "The intersection of AI and cybersecurity in modern enterprise infrastructure"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract and verify JWT from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing authorization token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with user's JWT (not service role)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      }
    });

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('Invalid user token:', userError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin using RLS-protected function
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || !isAdmin) {
      console.error('User is not admin:', adminError?.message);
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Admin user verified, generating blog article...');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Select a random topic based on profile
    const randomTopic = profileBasedTopics[Math.floor(Math.random() * profileBasedTopics.length)];
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a senior technology executive with 25+ years of experience in digital transformation, AI strategy, and enterprise architecture. Write in a professional, insightful tone that demonstrates deep technical and business knowledge.`
          },
          {
            role: 'user',
            content: `Write a comprehensive blog post about: ${randomTopic}. 

Category: Technology Leadership

The blog post should:
- Be 1000-1500 words
- Include specific technical details and business insights
- Include actionable insights for executives and technical leaders
- Use markdown formatting with proper headers
- End with a call to action

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
    let content = data.choices[0].message.content;
    
    // Remove markdown code blocks if present
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }
    
    const generatedContent = JSON.parse(content);

    // Insert blog post for the authenticated admin user
    // RLS will enforce that only admins can insert
    const { error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        user_id: user.id,
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        content: generatedContent.content,
        read_time: generatedContent.readTime,
        category: 'Technology Leadership'
      });

    if (insertError) {
      console.error('Error inserting blog post:', insertError);
      throw insertError;
    }

    console.log('Successfully generated and inserted blog post');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Generated blog post successfully',
      topic: randomTopic
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in auto-generate-blog function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
