export function Hero() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="max-w-6xl w-full">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="text-sm font-mono text-gray-400 mb-4 tracking-wider">
                CHRISTOPHER_TAYLOR.EXE
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight">
                <span className="block">CHRIS</span>
                <span className="block text-gray-500">TAYLOR</span>
              </h1>
              <div className="text-xl md:text-2xl text-gray-300 mt-8 font-light">
                CEO/CTO • AI Strategist • Digital Transformer
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-1 mb-16">
            <div className="bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="text-4xl font-light mb-2">$100M+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Operational Savings</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="text-4xl font-light mb-2">75%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Efficiency Gains</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="text-4xl font-light mb-2">25+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</div>
            </div>
          </div>

          {/* Core Capabilities */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light mb-4">CORE CAPABILITIES</h2>
              <div className="w-24 h-px bg-white mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="text-lg font-light mb-2">AI Innovation</div>
                <div className="text-sm text-gray-400">Strategic Implementation</div>
              </div>
              <div className="text-center p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="text-lg font-light mb-2">Digital Transformation</div>
                <div className="text-sm text-gray-400">Enterprise Scale</div>
              </div>
              <div className="text-center p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="text-lg font-light mb-2">M&A Integration</div>
                <div className="text-sm text-gray-400">Fortune 500 Advisory</div>
              </div>
              <div className="text-center p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="text-lg font-light mb-2">Venture Capital</div>
                <div className="text-sm text-gray-400">Active Fundraising</div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <div className="inline-block">
              <div className="text-sm font-mono text-gray-400 mb-4 tracking-wider">
                CONNECT
              </div>
              <div className="space-y-2">
                <div className="text-lg">424-202-2836</div>
                <div className="text-lg">ByChrisTaylor@icloud.com</div>
                <div className="text-sm text-gray-400">Available for Executive Consultation</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-1 h-32 bg-white/20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-1 h-24 bg-white/20 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-10 w-24 h-1 bg-white/20 animate-pulse" style={{animationDelay: '2s'}}></div>
    </div>
  );
}