import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";

const TermsOfUse = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Use — TaylorVentureLab™</title>
        <meta name="description" content="Terms of Use for TaylorVentureLab™. Review the terms and conditions governing your use of our website." />
      </Helmet>
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            Terms of Use
          </h1>
          <p className="text-muted-foreground mb-12">Effective Date: December 2024</p>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <p className="text-foreground/90 leading-relaxed">
              Welcome to TaylorVentureLab™. By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree, please do not use this website.
            </p>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">1) Informational Use Only</h2>
              <p className="text-foreground/80">
                The content on this website is provided for general informational purposes only. It does not constitute legal, financial, investment, security, or professional advice. You should consult qualified professionals before making decisions based on information found on this site.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">2) No Warranties</h2>
              <p className="text-foreground/80">
                This website and its content are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or accuracy. TaylorVentureLab™ does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">3) Limitation of Liability</h2>
              <p className="text-foreground/80">
                To the fullest extent permitted by applicable law, TaylorVentureLab™ and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or use, arising out of or related to your use of this website, even if advised of the possibility of such damages.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">4) Intellectual Property</h2>
              <p className="text-foreground/80">
                All content, trademarks, logos, and intellectual property displayed on this website are the property of TaylorVentureLab™ or their respective owners. You may not reproduce, distribute, modify, or create derivative works from any content without prior written permission.
              </p>
              <p className="text-foreground/80">
                TaylorVentureLab™, Prime Radiant Guard™, SikatLabs™, SikatOne™, Mother AI™, Educational Intelligence (EIQ™), ID Future Stars™ (IDFS™), and ID Collective™ are trademarks of TaylorVentureLab™.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">5) Acceptable Use</h2>
              <p className="text-foreground/80">You agree not to:</p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any systems or networks</li>
                <li>Interfere with the operation of the website</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Scrape, harvest, or collect data without permission</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">6) Third-Party Links</h2>
              <p className="text-foreground/80">
                This website may contain links to third-party websites. TaylorVentureLab™ is not responsible for the content, privacy practices, or availability of those sites. Linking does not imply endorsement.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">7) Indemnification</h2>
              <p className="text-foreground/80">
                You agree to indemnify and hold harmless TaylorVentureLab™ and its affiliates from any claims, damages, losses, or expenses arising out of your use of the website or violation of these Terms.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">8) Governing Law</h2>
              <p className="text-foreground/80">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">9) Changes to Terms</h2>
              <p className="text-foreground/80">
                We reserve the right to modify these Terms at any time. Changes will be effective when posted on this page. Your continued use of the website constitutes acceptance of the modified Terms.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">10) Contact</h2>
              <p className="text-foreground/80">
                For questions about these Terms, contact: legal@taylorventurelab.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsOfUse;
