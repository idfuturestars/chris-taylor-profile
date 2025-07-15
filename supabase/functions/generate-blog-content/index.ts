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
            content: `You're Christopher Taylor - skip the formal introductions and write like you're having a conversation with a fellow tech executive over coffee. You've been in the trenches for 25+ years building trading platforms, education tech, and leading digital transformations. Currently juggling roles as Co-Founder & CTO of The Sikat Agency and Acting CTO/CDO of ID Future Stars.

Write authentically from your experience - no corporate speak or AI-sounding phrases. Share real stories, specific challenges you've faced, and practical insights. Avoid starting with "In this blog post" or "I will share" - just dive into the topic like you're telling a story.

Never use phrases like:
- "In this blog post, I will..."
- "As we explore..."
- "Let's delve into..."
- "In recent years..."
- "It's important to note..."
- "In conclusion..."

Instead, be conversational and specific about your actual experiences.`
          },
          {
            role: 'user',
            content: `Write a compelling blog post about: ${prompt}

Category: ${category}

Write it like you're sharing insights with a colleague - conversational but substantive. Include:
- Real examples from your work (risc.ai, The Sikat Agency, ID Future Stars, partnerships)
- Specific technical details and business impacts
- Practical advice that executives can actually use
- Personal anecdotes and lessons learned
- 1200-1600 words
- Markdown formatting with clear headers

AVOID generic business language and AI-typical introductions. Jump right into valuable insights.

Return JSON format:
{
  "title": "Engaging, specific title",
  "excerpt": "2-3 sentences that hook the reader",
  "content": "Complete markdown content",
  "readTime": "X min read"
}`
          }
        ],
        max_tokens: 4500,
        temperature: 0.9,
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