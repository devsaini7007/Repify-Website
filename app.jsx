import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Cpu, 
  Zap, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Video, 
  Mic, 
  Users, 
  Clock, 
  Menu, 
  X,
  Sparkles,
  BarChart,
  Globe,
  MessageSquare,
  Copy,
  Loader,
  Calendar // Added Calendar icon
} from 'lucide-react';

// --- Sub-Components ---

const Button = ({ children, primary, className = "", onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
      primary 
        ? "bg-[#ff4040] text-white shadow-[#ff4040]/25 hover:bg-red-600" 
        : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
    } ${className}`}
  >
    {children}
  </button>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-[#ff4040]/50 transition-colors duration-300 group">
    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#ff4040]/20 transition-colors">
      <Icon className="w-6 h-6 text-[#ff4040]" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, text }) => (
  <div className="relative pl-8 md:pl-0">
    <div className="hidden md:flex absolute -left-4 top-0 w-8 h-8 bg-[#ff4040] rounded-full items-center justify-center text-white font-bold z-10">
      {number}
    </div>
    <div className="md:border-l-2 md:border-slate-800 md:pl-8 pb-12 last:pb-0 relative">
      <div className="md:hidden absolute -left-8 top-0 w-6 h-6 bg-[#ff4040] rounded-full flex items-center justify-center text-white text-xs font-bold">
        {number}
      </div>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-slate-400">{text}</p>
    </div>
  </div>
);

const PricingCard = ({ title, price, features, recommended }) => (
  <div className={`relative p-8 rounded-3xl border ${recommended ? 'border-[#ff4040] bg-slate-900/80 shadow-2xl shadow-[#ff4040]/20' : 'border-slate-800 bg-slate-900/40'} flex flex-col`}>
    {recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ff4040] text-white px-4 py-1 rounded-full text-sm font-bold">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <div className="text-4xl font-bold text-white mb-6">
      {price}<span className="text-lg text-slate-500 font-normal">/mo</span>
    </div>
    <div className="flex-grow space-y-4 mb-8">
      {features.map((feat, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#ff4040] flex-shrink-0 mt-0.5" />
          <span className="text-slate-300 text-sm">{feat}</span>
        </div>
      ))}
    </div>
    <Button primary={recommended} className="w-full" onClick={() => window.open('https://calendly.com/', '_blank')}>
      Get Started
    </Button>
  </div>
);

// --- AI Logic ---
const generateViralScript = async (topic, setScript, setIsGenerating, setError) => {
  setIsGenerating(true);
  setError('');
  const apiKey = ""; // Set by environment
  
  const systemPrompt = `You are an expert viral video scriptwriter for TikTok, Instagram Reels, and YouTube Shorts.
  Your goal is to write a high-retention script based on the user's topic.
  Format the output clearly with these sections:
  1. HOOK (0-3s): Attention-grabbing visual or statement.
  2. BODY (3-45s): Deliver value, story, or entertainment concisely.
  3. CTA (45-60s): Call to Action.
  Use a conversational, punchy tone. Do not use hashtags. Keep it under 150 words total.`;

  const userQuery = `Write a viral video script about: "${topic}"`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    
    // Simple backoff retry logic
    let retries = 0;
    const maxRetries = 3;
    let result;

    while (retries < maxRetries) {
        try {
            result = await model.generateContent({
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            });
            break;
        } catch (e) {
            retries++;
            if (retries === maxRetries) throw e;
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retries)));
        }
    }

    const text = result.response.text();
    setScript(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    setError("Our AI servers are currently overloaded. Please try again in a moment.");
  } finally {
    setIsGenerating(false);
  }
};

// --- Main Application ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // AI Generator State
  const [topic, setTopic] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCalendar = () => {
    window.open('https://calendly.com/', '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-[#ff4040] selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            {/* Logo Changed: Removed Icon, just Text in Brand Color */}
            <span className="text-2xl font-bold text-[#ff4040] tracking-tight">Repify.</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('process')} className="hover:text-[#ff4040] transition-colors">How it Works</button>
            <button onClick={() => scrollToSection('ai-tool')} className="hover:text-[#ff4040] transition-colors flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Tool</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-[#ff4040] transition-colors">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-[#ff4040] transition-colors">Pricing</button>
            <Button primary onClick={openCalendar}>Book a Demo</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-6 flex flex-col gap-4 shadow-2xl">
            <button onClick={() => scrollToSection('process')} className="text-left py-2 hover:text-[#ff4040]">How it Works</button>
            <button onClick={() => scrollToSection('ai-tool')} className="text-left py-2 hover:text-[#ff4040]">AI Script Tool</button>
            <button onClick={() => scrollToSection('features')} className="text-left py-2 hover:text-[#ff4040]">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-left py-2 hover:text-[#ff4040]">Pricing</button>
            <Button primary onClick={openCalendar}>Book a Demo</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#ff4040]/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[#ff4040] text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Personal Branding</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Create Content <br />
              <span className="text-[#ff4040]">
                Without a Camera
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed">
              We build a hyper-realistic AI clone of you. Generate a month's worth of videos in minutes. No filming. No retakes. Just scaling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button primary onClick={() => scrollToSection('process')}>
                Clone Yourself
              </Button>
              <Button onClick={() => setShowVideoModal(true)} className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Watch Demo
              </Button>
            </div>
            
            <div className="pt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs overflow-hidden">
                     <Users className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
              <p>Trusted by 100+ Founders</p>
            </div>
          </div>

          {/* Abstract Hero Visual */}
          <div className="relative">
            <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
               {/* Mock Video Interface */}
               <div className="aspect-[4/5] bg-slate-800 rounded-xl overflow-hidden relative flex flex-col">
                  {/* Mock Screen Content */}
                  <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center relative">
                     {/* Scan Line Animation */}
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff4040]/10 to-transparent w-full h-[20%] animate-[scan_3s_ease-in-out_infinite]" style={{ top: '50%', transform: 'translateY(-50%)' }} />
                     
                     <div className="w-32 h-32 rounded-full border-4 border-[#ff4040]/30 flex items-center justify-center relative">
                        <div className="w-24 h-24 bg-slate-700 rounded-full animate-pulse" />
                        <div className="absolute inset-0 border-t-4 border-[#ff4040] rounded-full animate-spin" />
                     </div>
                     
                     <div className="absolute bottom-8 left-0 right-0 text-center">
                        <span className="bg-slate-950/80 text-[#ff4040] px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest border border-[#ff4040]/30">
                          Synthesizing Voice...
                        </span>
                     </div>
                  </div>

                  {/* Mock Controls */}
                  <div className="h-16 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-800" />
                      <div className="w-24 h-2 bg-slate-800 rounded-full mt-3" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#ff4040] flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
               </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -right-8 top-20 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl animate-[bounce_3s_infinite]">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Time Saved</div>
                  <div className="font-bold text-white">12 Hrs/Week</div>
                </div>
              </div>
            </div>

            <div className="absolute -left-8 bottom-32 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl animate-[bounce_4s_infinite]">
              <div className="flex items-center gap-3">
                <div className="bg-[#ff4040]/20 p-2 rounded-lg text-[#ff4040]">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Videos Generated</div>
                  <div className="font-bold text-white">30 Shorts/Mo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white">The "Content Trap" is Real</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-14 h-14 bg-red-500/10 text-[#ff4040] rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Camera Shy?</h3>
              <p className="text-slate-400">Spending hours setting up lights, memorizing scripts, and doing 50 takes just for one decent minute of video.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">No Time?</h3>
              <p className="text-slate-400">Running a business is a full-time job. Editing, captions, and posting takes time you simply don't have.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-14 h-14 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Inconsistent?</h3>
              <p className="text-slate-400">Algorithms punish inconsistency. But posting every day feels impossible without a dedicated team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Process) */}
      <section id="process" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              The <span className="text-[#ff4040]">Repify</span> System
            </h2>
            <p className="text-lg text-slate-400 mb-12">
              We've streamlined the process. You do the work once, and our AI engines work for you forever.
            </p>
            
            <div className="space-y-2">
              <StepCard 
                number="01"
                title="The Calibration"
                text="Upload a 2-minute video of yourself speaking naturally. We use this to train our proprietary AI model on your face, voice, and mannerisms."
              />
              <StepCard 
                number="02"
                title="The Strategy"
                text="Our content team (humans, not bots) researches your niche and creates a month's worth of viral hooks and scripts tailored to your brand."
              />
              <StepCard 
                number="03"
                title="The Generation"
                text="We feed the scripts into your AI Clone. It generates perfect video, lip-synced and voiced by you. We edit, caption, and deliver."
              />
            </div>
          </div>
          <div className="relative h-full min-h-[400px] bg-slate-900 rounded-2xl border border-slate-800 p-8 flex flex-col justify-center items-center overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            {/* Visualizing the "Clone" process */}
            <div className="flex items-center gap-8 relative z-10">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 text-slate-400" />
                </div>
                <div className="text-sm font-bold text-slate-400">Real You</div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff4040] animate-pulse"></div>
                <div className="w-20 h-1 bg-gradient-to-r from-slate-700 to-[#ff4040] rounded-full"></div>
                <div className="text-xs text-[#ff4040] font-mono">CLONING</div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-[#ff4040] shadow-[0_0_30px_rgba(255,64,64,0.3)] flex items-center justify-center mb-4 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[#ff4040]/10 animate-pulse"></div>
                   <Zap className="w-10 h-10 text-[#ff4040] relative z-10" />
                </div>
                <div className="text-sm font-bold text-[#ff4040]">AI You</div>
              </div>
            </div>
            
            <div className="mt-12 w-full bg-slate-950 rounded-lg p-4 border border-slate-800">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <div className="text-xs text-slate-500 ml-2">generator_log.txt</div>
               </div>
               <div className="font-mono text-xs text-green-400 space-y-1">
                 <p>{'>'} Initializing voice synthesis...</p>
                 <p>{'>'} Mapping facial geometry...</p>
                 <p>{'>'} Rendering texture (4k)...</p>
                 <p>{'>'} <span className="text-white">Output: viral_short_01.mp4 generated successfully.</span></p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW: Gemini API Integration Section */}
      <section id="ai-tool" className="py-24 bg-slate-900 relative border-y border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff4040]/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[#ff4040] text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Gemini 2.5 Flash</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Test Drive Our <span className="text-[#ff4040]">AI Script Writer</span>
            </h2>
            <p className="text-lg text-slate-400">
              Experience the power of our viral script engines. Enter a topic, and watch us structure a high-retention video for you in seconds.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input 
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., How to start a coffee shop, Real estate tips, Morning routine..."
                className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff4040] transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && generateViralScript(topic, setGeneratedScript, setIsGenerating, setAiError)}
              />
              <Button 
                primary 
                onClick={() => generateViralScript(topic, setGeneratedScript, setIsGenerating, setAiError)}
                disabled={isGenerating || !topic}
                className="flex items-center justify-center gap-2 min-w-[200px]"
              >
                {isGenerating ? <Loader className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                {isGenerating ? 'Writing...' : 'Generate Script'}
              </Button>
            </div>

            {aiError && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {aiError}
              </div>
            )}

            {generatedScript && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#ff4040]" />
                    Generated Script
                  </h3>
                  <button 
                    onClick={copyToClipboard}
                    className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-300 shadow-inner">
                  {generatedScript}
                </div>
              </div>
            )}

            {!generatedScript && !isGenerating && !aiError && (
              <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                 <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                   <Zap className="w-8 h-8" />
                 </div>
                 <p className="text-slate-500">Your viral script will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Everything You Need To Dominate</h2>
            <p className="text-slate-400">More than just an avatar. A complete production ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Mic}
              title="Voice Cloning"
              description="We capture your tone, cadence, and accent perfectly. It sounds exactly like you, even in other languages."
            />
            <FeatureCard 
              icon={Video}
              title="4K Lip Sync"
              description="No awkward robotic mouths. Our tech ensures perfect lip synchronization with the audio track."
            />
            <FeatureCard 
              icon={Globe}
              title="Multi-Language"
              description="Want to reach a global audience? Your clone can speak Spanish, French, or Mandarin instantly."
            />
            <FeatureCard 
              icon={Sparkles}
              title="Auto-Editing"
              description="We don't just give you raw video. We add B-roll, captions, and dynamic cuts to retain attention."
            />
            <FeatureCard 
              icon={Zap}
              title="Instant Turnaround"
              description="From script approval to final video in less than 24 hours. Keep your feed active daily."
            />
             <FeatureCard 
              icon={CheckCircle}
              title="Brand Consistency"
              description="Your clone never has a bad hair day, never gets sick, and always has perfect lighting."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Simple Pricing. Infinite Scale.</h2>
          <p className="text-slate-400">Choose the package that fits your growth goals.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard 
            title="Starter"
            price="$1290"
            features={[
              "Custom AI Avatar Creation",
              "15 Short-Form Videos / mo",
              "Script Writing Included",
              "Professional Editing & Captions",
              "48h Turnaround"
            ]}
          />
          <PricingCard 
            recommended={true}
            title="Growth"
            price="$1,997"
            features={[
              "Priority AI Model Training",
              "20 Short-Form Videos / mo",
              "Multi-Language Support (2 langs)",
              "Strategy Call Monthly",
              "Dedicated Account Manager"
            ]}
          />
          <PricingCard 
            title="Domination"
            price="$2,597"
            features={[
              "Ultra-HD 4K Model",
              "Daily Short-Form (30 videos)",
              "Unlimited Languages",
              "Social Media Management & Posting",
              "Analytics Dashboard"
            ]}
          />
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 -z-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Ready to Clone Yourself?</h2>
          <p className="text-xl text-slate-400 mb-10">
            Join the waitlist or book a discovery call. We only onboard 5 new clients per month to ensure quality.
          </p>
          
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl text-left max-w-xl mx-auto">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); openCalendar(); }}>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff4040] transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff4040] transition-colors" placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Content Goal</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff4040] transition-colors">
                  <option>I want to save time</option>
                  <option>I want to scale output</option>
                  <option>I hate being on camera</option>
                </select>
              </div>
              <Button primary className="w-full justify-center mt-4 flex items-center gap-2">
                Secure Your Spot <Calendar className="w-5 h-5" />
              </Button>
            </form>
            <p className="text-xs text-slate-500 text-center mt-4">No credit card required for consultation.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#ff4040] tracking-tight">Repify.</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Repify Agency. All rights reserved.
          </div>
          <div className="flex gap-6">
             <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
             <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
             <a href="#" className="text-slate-500 hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

      {/* Video Modal Overlay (Mock) */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-4xl aspect-video rounded-2xl border border-slate-700 relative flex items-center justify-center">
             <button 
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 text-white hover:text-[#ff4040]"
             >
               <div className="flex items-center gap-2 font-bold">Close <X /></div>
             </button>
             <div className="text-center">
               <Play className="w-16 h-16 text-[#ff4040] mx-auto mb-4 opacity-50" />
               <h3 className="text-2xl font-bold text-white">Demo Reel Placeholder</h3>
               <p className="text-slate-400 mt-2">Integrate your VSL or demo video here.</p>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
