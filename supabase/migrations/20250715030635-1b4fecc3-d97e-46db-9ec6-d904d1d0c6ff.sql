-- Update RLS policies for blog_posts to allow public reading
-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own blog posts" ON public.blog_posts;

-- Create new policy to allow public reading of blog posts
CREATE POLICY "Blog posts are publicly viewable" 
ON public.blog_posts 
FOR SELECT 
USING (true);

-- Keep the other policies for authenticated users to manage their own posts