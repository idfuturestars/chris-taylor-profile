export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Minimalist Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* AI Prompt Interface */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-start space-x-3 text-left max-w-4xl">
            <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-mono">
              {'>'}
            </div>
            <div className="flex-1">
              <div className="font-mono text-sm text-muted-foreground mb-2">
                prompt: generate_executive_profile()
              </div>
              <div className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight">
                <span className="font-bold">Christopher Taylor</span>
                <br />
                <span className="text-muted-foreground">Dynamic C-Level Executive</span>
                <br />
                <span className="text-lg md:text-xl text-muted-foreground font-normal">
                  CEO/CTO Visionary specializing in AI-driven transformation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Output Style */}
        <div className="text-left max-w-4xl mx-auto mb-12 animate-fade-in animation-delay-200">
          <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm">
            <div className="text-accent mb-2">$ ./analyze_executive.sh --profile christopher_taylor</div>
            <div className="text-muted-foreground mb-4">Processing capabilities...</div>
            
            <div className="space-y-2">
              <div>
                <span className="text-primary">✓</span> Strategic Leadership: $100M+ operational savings
              </div>
              <div>
                <span className="text-primary">✓</span> AI Innovation: 75% efficiency increase
              </div>
              <div>
                <span className="text-primary">✓</span> Global Expansion: Multi-continent operations
              </div>
              <div>
                <span className="text-primary">✓</span> M&A Integration: Fortune 500 advisory
              </div>
              <div>
                <span className="text-primary">✓</span> Venture Capital: Active fundraising leadership
              </div>
            </div>
            
            <div className="mt-4 text-accent">Analysis complete. Executive profile generated.</div>
          </div>
        </div>

        {/* Contact Terminal */}
        <div className="text-left max-w-2xl mx-auto animate-fade-in animation-delay-400">
          <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm">
            <div className="text-accent mb-2">$ contact --executive christopher_taylor</div>
            
            <div className="space-y-1 text-muted-foreground">
              <div>tel: 424-202-2836</div>
              <div>email: ByChrisTaylor@icloud.com</div>
              <div>linkedin: linkedin.com/in/keepingupwithchristaylor</div>
              <div>status: available_for_consultation</div>
            </div>
            
            <div className="mt-4">
              <span className="text-accent">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>

        {/* Floating Elements - Minimal */}
        <div className="absolute top-1/4 left-1/4 w-px h-32 bg-border opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-px h-24 bg-border opacity-20 animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-px bg-border opacity-20 animate-pulse animation-delay-1000"></div>
      </div>
    </section>
  );
}