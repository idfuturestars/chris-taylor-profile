export function Hero() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hero Image Section */}
      <div className="relative min-h-screen flex items-center">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/c03b871b-2b26-4d96-afbb-1f0e96f8735c.png" 
            alt="Christopher Taylor" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 items-center min-h-screen">
          
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-sm font-mono text-gray-300 tracking-[0.2em] uppercase">
                Co-Founder • The Sikat Agency
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight">
                <span className="block">CHRISTOPHER</span>
                <span className="block text-gray-300">TAYLOR</span>
              </h1>
              
              <div className="text-xl md:text-2xl text-gray-200 font-light max-w-lg">
                CEO/CTO • AI Strategist • Digital Transformation Leader
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-8 py-8 border-t border-b border-white/20">
              <div>
                <div className="text-3xl font-light">$100M+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Operational Savings</div>
              </div>
              <div>
                <div className="text-3xl font-light">25+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-light">Fortune 500</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Advisory</div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div className="text-sm font-mono text-gray-300 tracking-[0.2em] uppercase">
                Connect
              </div>
              <div className="space-y-2">
                <div className="text-lg font-light">424-202-2836</div>
                <div className="text-lg font-light">ByChrisTaylor@icloud.com</div>
                <div className="text-sm text-gray-400">Available for Executive Consultation</div>
              </div>
            </div>
          </div>

        </div>

        {/* Geometric Elements */}
        <div className="absolute top-20 left-20 w-px h-32 bg-white/30"></div>
        <div className="absolute bottom-20 right-20 w-px h-24 bg-white/30"></div>
        <div className="absolute top-1/2 left-10 w-24 h-px bg-white/30"></div>
        
      </div>
    </div>
  );
}