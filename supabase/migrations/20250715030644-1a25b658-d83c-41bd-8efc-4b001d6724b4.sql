-- Update RLS policies for blog_posts to allow public reading
DROP POLICY IF EXISTS "Users can view their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can create their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can update their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON public.blog_posts;

-- Create new policies for public blog access
CREATE POLICY "Blog posts are publicly readable" 
ON public.blog_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (auth.uid() = user_id);