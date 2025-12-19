import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy — TaylorVentureLab™</title>
        <meta name="description" content="Privacy Policy for TaylorVentureLab™. Learn how we collect, use, and protect your personal data." />
      </Helmet>
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-12">Effective Date: December 2024</p>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <p className="text-foreground/90 leading-relaxed">
              TaylorVentureLab™ ("we," "us," "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect personal data when you visit our website or contact us.
            </p>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">1) Data Controller</h2>
              <div className="text-foreground/80 space-y-2">
                <p><strong>Controller:</strong> TaylorVentureLab™</p>
                <p><strong>Contact:</strong> privacy@taylorventurelab.com</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">2) Personal Data We Collect</h2>
              <p className="text-foreground/80">We may collect:</p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                <li>Contact details (name, email, organization) submitted via forms</li>
                <li>Message content you send us</li>
                <li>Technical data (IP address, browser type, device identifiers, pages visited, approximate location derived from IP)</li>
                <li>Cookies and similar technologies (see Cookie Policy)</li>
              </ul>
              <p className="text-foreground/80">
                We do not intentionally collect sensitive personal data. Please do not submit confidential or sensitive information via website forms.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">3) How We Use Personal Data</h2>
              <p className="text-foreground/80">We use personal data to:</p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                <li>Respond to inquiries and schedule briefings</li>
                <li>Improve website performance and security</li>
                <li>Prevent abuse, spam, and fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">4) Legal Bases (GDPR/UK GDPR)</h2>
              <p className="text-foreground/80">Where applicable, we rely on:</p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                <li><strong>Legitimate Interests</strong> (responding to requests, securing our services, improving the site)</li>
                <li><strong>Consent</strong> (where required for cookies/marketing)</li>
                <li><strong>Contract</strong> (if we enter into an agreement)</li>
                <li><strong>Legal Obligation</strong> (compliance and recordkeeping)</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">5) Sharing & Disclosure</h2>
              <p className="text-foreground/80">
                We may share data with trusted service providers who support website hosting, analytics, security, and communications, under appropriate contractual safeguards. We do not sell personal data.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">6) International Transfers</h2>
              <p className="text-foreground/80">
                If data is transferred outside your jurisdiction, we use appropriate safeguards (such as standard contractual clauses where required).
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">7) Retention</h2>
              <p className="text-foreground/80">
                We retain personal data only as long as necessary for the purposes described above or as required by law.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">8) Your Rights (GDPR/UK GDPR)</h2>
              <p className="text-foreground/80">You may have the right to:</p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                <li>Access, correct, delete your data</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent (where applicable)</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
              <p className="text-foreground/80">
                To exercise rights, contact: privacy@taylorventurelab.com
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">9) Security</h2>
              <p className="text-foreground/80">
                We implement reasonable administrative, technical, and organizational safeguards designed to protect personal data. No method of transmission or storage is 100% secure.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">10) Children</h2>
              <p className="text-foreground/80">
                This website is not directed to children under 16. We do not knowingly collect data from children.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">11) Updates</h2>
              <p className="text-foreground/80">
                We may update this policy from time to time. Changes will be posted on this page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
