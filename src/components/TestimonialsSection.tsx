import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Chief Technology Officer",
    company: "Fortune 100 Financial Services",
    content: "Christopher's strategic vision and execution capabilities are unparalleled. His AI implementation framework helped us achieve a 60% reduction in processing time while maintaining security standards. The ROI was evident within the first quarter.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    title: "Chief Executive Officer",
    company: "Healthcare Technology Leader",
    content: "Working with Chris transformed our entire operational approach. His ability to translate complex technical concepts into actionable business strategy is remarkable. We've seen $25M in savings over 18 months.",
    rating: 5
  },
  {
    id: 3,
    name: "Dr. Amanda Foster",
    title: "Chief Innovation Officer",
    company: "Global Manufacturing Corporation",
    content: "Christopher doesn't just implement technology—he transforms organizations. His leadership during our digital transformation was crucial to our success. The team's productivity increased by 45% under his guidance.",
    rating: 5
  },
  {
    id: 4,
    name: "David Park",
    title: "President",
    company: "Enterprise Software Company",
    content: "Chris brings a rare combination of technical depth and strategic thinking. His insights into AI adoption helped us stay ahead of market trends and position ourselves as industry leaders.",
    rating: 5
  }
];

const clientLogos = [
  { name: "Fortune 500 Tech", width: "120px" },
  { name: "Global Healthcare", width: "100px" },
  { name: "Financial Services", width: "140px" },
  { name: "Manufacturing Corp", width: "110px" },
  { name: "Enterprise Software", width: "130px" }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Client <span className="text-muted-foreground">Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by Fortune 500 executives and industry leaders worldwide
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card border border-border rounded-lg p-8">
              {/* Quote Icon */}
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>

              {/* Attribution */}
              <div className="border-t border-border pt-4">
                <div className="text-foreground font-medium">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.title}
                </div>
                <div className="text-sm font-mono text-primary tracking-wider uppercase">
                  {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Logos */}
        <div className="border-t border-border pt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-light tracking-tight mb-4">
              Trusted by Industry Leaders
            </h3>
            <p className="text-muted-foreground">
              Strategic advisory and implementation services for Fortune 500 companies
            </p>
          </div>

          {/* Logo Grid */}
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {clientLogos.map((logo, index) => (
              <div 
                key={index}
                className="bg-muted/50 rounded-lg px-6 py-4 text-center min-w-[120px]"
                style={{ width: logo.width }}
              >
                <div className="text-sm font-mono text-muted-foreground">
                  {logo.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-light text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Client Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-light text-primary mb-2">$2b+</div>
            <div className="text-sm text-muted-foreground">Total Savings Generated</div>
          </div>
          <div>
            <div className="text-3xl font-light text-primary mb-2">25+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-light text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Strategic Projects</div>
          </div>
        </div>
      </div>
    </section>
  );
}