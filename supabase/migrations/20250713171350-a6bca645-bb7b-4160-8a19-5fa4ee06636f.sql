-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a scheduled job to generate blog articles weekly (every Monday at 9 AM)
SELECT cron.schedule(
  'generate-weekly-blog-article',
  '0 9 * * 1', -- Every Monday at 9 AM
  $$
  SELECT
    net.http_post(
        url:='https://hxuxucbzytrhgcfjhkma.supabase.co/functions/v1/auto-generate-blog',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dXh1Y2J6eXRyaGdjZmpoa21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjIxNTIsImV4cCI6MjA2NjY5ODE1Mn0.sKjgw8sMkmzhj_npqte2pJAtlofYB83FF__t3xZAqYc"}'::jsonb,
        body:='{"schedule": "weekly"}'::jsonb
    ) as request_id;
  $$
);