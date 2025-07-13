import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, category = 'Technology Leadership' } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

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
            content: `You are Christopher Taylor, a senior technology executive with 25+ years of experience in digital transformation, AI strategy, and enterprise architecture. You're currently Co-Founder & CTO of The Sikat Agency and Acting CTO/CDO of ID Future Stars. Your expertise spans trading platforms (risc.ai), education technology, and strategic partnerships with companies like Top Global Telecom and Fintech Firm. Write in a professional, insightful tone that demonstrates deep technical and business knowledge.`
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
    let content = data.choices[0].message.content;
    
    // Remove markdown code blocks if present
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }
    
    const generatedContent = JSON.parse(content);

    return new Response(JSON.stringify(generatedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-blog-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});