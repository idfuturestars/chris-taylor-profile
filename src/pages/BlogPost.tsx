import { Layout } from "@/components/Layout";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag, Share2, Mail, Twitter, Linkedin } from "lucide-react";
import { getBlogPost } from "@/data/blogPosts";
import { Helmet } from "react-helmet-async";
import { formatInlineMarkdown, escapeHtml } from "@/lib/sanitize";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <Navigate to="/insights" replace />;
  }

  // Convert markdown-style formatting to JSX with XSS protection
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListTag = listType;
        elements.push(
          <ListTag key={elements.length} className={listType === 'ul' ? 'list-disc list-inside space-y-2 my-4 text-muted-foreground' : 'list-decimal list-inside space-y-2 my-4 text-muted-foreground'}>
            {currentList.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, i) => {
      // Headers - escape content but allow safe formatting
      if (line.startsWith('## ')) {
        flushList();
        const headerText = escapeHtml(line.replace('## ', ''));
        elements.push(
          <h2 key={i} className="text-2xl font-serif font-semibold text-foreground mt-10 mb-4">
            {headerText}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        const headerText = escapeHtml(line.replace('### ', ''));
        elements.push(
          <h3 key={i} className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
            {headerText}
          </h3>
        );
      }
      // Horizontal rule
      else if (line.trim() === '---') {
        flushList();
        elements.push(<hr key={i} className="border-border my-8" />);
      }
      // List items
      else if (line.match(/^[-*] /)) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(line.replace(/^[-*] /, ''));
      }
      else if (line.match(/^\d+\) /)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(line.replace(/^\d+\) /, ''));
      }
      // Empty line
      else if (line.trim() === '') {
        flushList();
      }
      // Regular paragraph - sanitize with formatInlineMarkdown
      else {
        flushList();
        elements.push(
          <p 
            key={i} 
            className="text-muted-foreground leading-relaxed my-4"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
          />
        );
      }
    });

    flushList();
    return elements;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Organization",
      "name": "TaylorVentureLab™"
    },
    "datePublished": post.date,
    "publisher": {
      "@type": "Organization",
      "name": "TaylorVentureLab™",
      "url": "https://taylorventurelab.com"
    }
  };

  // Use a stable URL for sharing (without relying on window.location during SSR)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | TaylorVentureLab™</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <article className="section">
        <div className="container-narrow">
          {/* Back Link */}
          <Link 
            to="/insights" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, i) => (
                <span key={i} className="label-caps flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-border py-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="text-foreground/80">
                  {post.author}
                </span>
              </div>
              
              {/* Social Sharing */}
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground mr-2 flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  Share
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  aria-label="Share on X (Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${shareUrl}`)}`}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  aria-label="Share via Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>

          {/* Footer CTA */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="trust-card text-center">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                Want to discuss this topic?
              </h3>
              <p className="text-muted-foreground mb-4">
                Request a briefing to explore how these concepts apply to your environment.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Request a Briefing
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </Layout>
  );
}
