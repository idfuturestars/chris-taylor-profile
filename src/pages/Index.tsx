import { Hero } from "@/components/Hero";
import { PortfolioSection } from "@/components/PortfolioSection";
import { BlogSection } from "@/components/BlogSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <PortfolioSection />
      <BlogSection />
    </main>
  );
};

export default Index;