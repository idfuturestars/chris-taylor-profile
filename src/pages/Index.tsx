import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { PortfolioSection } from "@/components/PortfolioSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BlogSection } from "@/components/BlogSection";
import { ContactSection } from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <AboutSection />
      <ExperienceTimeline />
      <PortfolioSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
    </main>
  );
};

export default Index;