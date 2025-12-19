import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";

export default function Disclaimer() {
  return (
    <Layout>
      <Helmet>
        <title>Disclaimer | TaylorVentureLab™</title>
        <meta name="description" content="Important disclaimers regarding TaylorVentureLab™ services, AI systems, security platforms, and investment information." />
        <link rel="canonical" href="https://bychristophertaylor.com/disclaimer" />
      </Helmet>

      <section className="section">
        <div className="container-narrow">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-8">
            Disclaimer
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg mb-8">
              Last updated: January 2025
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              General Information Disclaimer
            </h2>
            <p className="text-muted-foreground mb-6">
              The content on this website is provided for informational purposes only. TaylorVentureLab™ 
              makes no representations or warranties of any kind, express or implied, about the completeness, 
              accuracy, reliability, suitability, or availability of the information, products, services, 
              or related graphics contained on this website for any purpose.
            </p>
            <p className="text-muted-foreground mb-6">
              Any reliance you place on such information is strictly at your own risk. In no event will 
              TaylorVentureLab™ be liable for any loss or damage including, without limitation, indirect 
              or consequential loss or damage, or any loss or damage whatsoever arising from loss of data 
              or profits arising out of, or in connection with, the use of this website.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              No Legal Advice
            </h2>
            <p className="text-muted-foreground mb-6">
              Nothing on this website constitutes legal advice. The content is provided for general 
              informational purposes and should not be construed as legal counsel. If you require legal 
              advice, please consult with a qualified attorney licensed to practice in your jurisdiction.
            </p>
            <p className="text-muted-foreground mb-6">
              TaylorVentureLab™, its products, and services are not law firms and do not provide legal 
              services. Any documents, templates, or guidance provided are for informational purposes only 
              and should be reviewed by qualified legal counsel before use.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              No Security Guarantee
            </h2>
            <p className="text-muted-foreground mb-6">
              While TaylorVentureLab™ and its products, including Prime Radiant Guard™, are designed with 
              security as a primary consideration, no security system is infallible. We do not guarantee 
              that our products or services will prevent all security breaches, unauthorized access, or 
              data loss.
            </p>
            <p className="text-muted-foreground mb-6">
              Security depends on many factors including, but not limited to, proper configuration, 
              ongoing maintenance, user behavior, and the broader security environment. Organizations 
              using our products remain responsible for their own security posture, compliance obligations, 
              and risk management decisions.
            </p>
            <p className="text-muted-foreground mb-6">
              The descriptions of security features on this website represent design intent and planned 
              capabilities. Actual performance may vary based on environment, configuration, and operating 
              conditions.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              AI Systems Disclaimer
            </h2>
            <p className="text-muted-foreground mb-6">
              TaylorVentureLab™ develops and deploys AI systems including, but not limited to, Prime 
              Radiant Guard™ and EIQ™ (Educational Intelligence™). These systems are designed with 
              governance, explainability, and human oversight as core principles.
            </p>
            <p className="text-muted-foreground mb-6">
              However, AI systems have inherent limitations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>AI outputs should not be treated as infallible or as substitutes for human judgment in high-stakes decisions</li>
              <li>AI models may produce unexpected results in edge cases or novel situations</li>
              <li>AI recommendations should be reviewed by qualified humans before implementation</li>
              <li>AI systems require ongoing monitoring, evaluation, and adjustment</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              TaylorVentureLab™ is committed to responsible AI development and deployment, including 
              bias monitoring, transparency, and human-in-the-loop controls. However, we do not guarantee 
              that AI systems will be free from errors, bias, or unintended consequences.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              No Investment Solicitation
            </h2>
            <p className="text-muted-foreground mb-6">
              Nothing on this website constitutes an offer to sell or a solicitation of an offer to 
              buy any securities. TaylorVentureLab™ is not a registered broker-dealer, investment 
              adviser, or securities exchange.
            </p>
            <p className="text-muted-foreground mb-6">
              Any references to investment, funding, or financial matters are provided for informational 
              purposes only and should not be construed as investment advice or an invitation to invest.
            </p>
            <p className="text-muted-foreground mb-6">
              If you are considering any investment, you should consult with a qualified financial 
              advisor and conduct your own due diligence. Past performance is not indicative of future 
              results.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Forward-Looking Statements
            </h2>
            <p className="text-muted-foreground mb-6">
              This website may contain forward-looking statements regarding TaylorVentureLab™'s plans, 
              expectations, and objectives. These statements are based on current expectations and 
              assumptions and are subject to risks and uncertainties that could cause actual results 
              to differ materially.
            </p>
            <p className="text-muted-foreground mb-6">
              Forward-looking statements can be identified by terms such as "believes," "expects," 
              "plans," "intends," "anticipates," "should," "designed to," "will," and similar expressions. 
              TaylorVentureLab™ undertakes no obligation to update forward-looking statements to reflect 
              events or circumstances after the date they are made.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              No Guarantees of Outcomes
            </h2>
            <p className="text-muted-foreground mb-6">
              TaylorVentureLab™ and its associated programs, including ID Future Stars™ (IDFS™) and 
              NIL Collective™, do not guarantee any outcomes, placements, admissions, NIL deals, 
              employment, or financial results.
            </p>
            <p className="text-muted-foreground mb-6">
              Participation in any program does not guarantee any specific result. Outcomes depend on 
              many factors including individual effort, market conditions, third-party decisions, and 
              circumstances beyond our control.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Third-Party Links
            </h2>
            <p className="text-muted-foreground mb-6">
              This website may contain links to external websites or services. TaylorVentureLab™ is 
              not responsible for the content, privacy practices, or accuracy of any third-party 
              websites. The inclusion of any link does not imply endorsement by TaylorVentureLab™.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Changes to This Disclaimer
            </h2>
            <p className="text-muted-foreground mb-6">
              TaylorVentureLab™ reserves the right to modify this disclaimer at any time. Changes 
              will be effective immediately upon posting to this website. Your continued use of the 
              website following the posting of changes constitutes your acceptance of such changes.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Contact
            </h2>
            <p className="text-muted-foreground mb-6">
              If you have questions about this disclaimer, please contact us through the form on our 
              Contact page.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
