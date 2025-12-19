import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllBlogPosts } from "@/data/blogPosts";

export default function Insights() {
  const posts = getAllBlogPosts();

  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-card to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="label-caps mb-4 block">Pulse Insight</span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">
              Insights
            </h1>
            <p className="text-xl text-muted-foreground">
              Notes on zero‑trust enforcement, ontology-driven security, identity 
              modernization, and responsible AI.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {posts.length > 0 && (
        <section className="section-tight">
          <div className="container-wide">
            <Link 
              to={`/insights/${posts[0].slug}`}
              className="block trust-card group hover:border-primary/30 transition-all"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {posts[0].tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="label-caps">{tag}</span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {posts[0].title}
              </h2>
              <p className="text-muted-foreground mb-4 max-w-2xl">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(posts[0].date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {posts[0].readTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <span>Read article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      {posts.length > 1 && (
        <section className="section-tight bg-card">
          <div className="container-wide">
            <h2 className="text-xl font-serif font-semibold text-foreground mb-8">
              More Insights
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post) => (
                <Link 
                  key={post.slug}
                  to={`/insights/${post.slug}`}
                  className="trust-card group hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-xs font-medium text-primary uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{post.readTime}</span>
                    <div className="flex items-center gap-2 text-primary">
                      <span>Read</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* CTA */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              Want to discuss these topics?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              I'm always interested in conversations about security architecture, 
              AI governance, and systems optimization.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Get in touch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}