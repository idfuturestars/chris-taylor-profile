import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Enterprise: Strategic Implementation for 2024",
    excerpt: "How Fortune 500 companies are leveraging AI to transform operations and achieve unprecedented efficiency gains.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "AI Strategy"
  },
  {
    id: 2,
    title: "Digital Transformation: Lessons from $100M+ Cost Savings",
    excerpt: "Real-world case studies on how strategic digital initiatives delivered massive operational savings.",
    date: "2024-01-08",
    readTime: "12 min read",
    category: "Digital Transformation"
  },
  {
    id: 3,
    title: "Building High-Performance Technical Teams in 2024",
    excerpt: "Leadership strategies for scaling engineering organizations and maintaining innovation velocity.",
    date: "2023-12-20",
    readTime: "6 min read",
    category: "Leadership"
  }
];

export function BlogSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Latest <span className="text-muted-foreground">Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Strategic thoughts on AI, digital transformation, and technology leadership
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="bg-card border border-border rounded-lg p-6 h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                {/* Category */}
                <div className="text-sm font-mono text-primary tracking-wider uppercase mb-3">
                  {post.category}
                </div>

                {/* Title */}
                <h3 className="text-xl font-light leading-tight mb-4 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 text-lg font-light text-foreground hover:text-primary transition-colors group">
            View All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}