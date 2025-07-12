import { Hero } from "@/components/Hero";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <ExpertiseSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </main>
  );
};

export default Index;
