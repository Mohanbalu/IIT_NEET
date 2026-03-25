import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Users, 
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Star,
  Layout,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hi! I am your Krishna Academy assistant. How can I help you today with NEET/JEE coaching?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    const newMessages = [...chatMessages, { role: 'user' as const, text: userMessage }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsTyping(true);

    try {
      // Use environment variable if available and not a placeholder, otherwise fallback
      let apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
        apiKey = "AIzaSyBBbcUb4GbxPGM2cu-uygqq7UfyjEC-IgU";
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Filter out the initial greeting if it's the only model message at the start
      // to ensure the conversation history is clean for the API
      const apiContents = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: apiContents,
        config: {
          systemInstruction: `You are the official AI Support Assistant for KRISHNA NEET/JEE ACADEMY in Guntur. 
          
          IDENTITY & TONE:
          - Professional, helpful, and encouraging.
          - Use clean, plain text ONLY.
          
          KNOWLEDGE BASE:
          - Academy Name: KRISHNA NEET/JEE ACADEMY.
          - Location: Pattabhipuram Main Road, Guntur.
          - Contact: 9704727292.
          - Courses: BiPC (NEET & EAPCET focus), MPC (EAPCET focus).
          - Methodology: Vector 4D Method (Depth, Speed, Accuracy, Resilience).
          - Admissions: Classes start March 20, 2026. Limited seats.
          - Facilities: Premium hostels for boys and girls, 24/7 security, healthy food, dedicated study halls.
          
          STRICT RESPONSE RULES:
          1. NEVER use Markdown formatting. No asterisks (*), no hashes (#), no bullet points (- or *).
          2. Use standard paragraphs and line breaks for structure.
          3. Keep answers direct and concise.
          4. If a student asks for something you don't know, tell them to call our admissions head at 9704727292.
          5. Do not mention other coaching centers.
          6. Always maintain the prestige of Krishna Academy.`
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that. Please call us at 9704727292 for immediate assistance.";
      setChatMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error && error.message === "API Key missing" 
        ? "Chat is currently unavailable. Please contact us directly at 9704727292."
        : "Sorry, I'm having trouble connecting. Please call us at 9704727292.";
      setChatMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const phone = formData.get('phone');
    
    const message = encodeURIComponent(`*I'm ready to aim for the top!*

I'd love to learn more about the programs at *Krishna Academy*.

*Student Name:* ${name}
*Contact:* ${phone}

Please share the details!`);
    const whatsappUrl = `https://wa.me/919704727292?text=${message}`;
    
    // Simulate API call and then redirect
    setTimeout(() => {
      setFormStatus('success');
      window.open(whatsappUrl, '_blank');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-brand-blue/95 backdrop-blur-md py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center overflow-hidden">
              <img 
                src="https://res.cloudinary.com/djcl2t35x/image/upload/f_auto,q_auto/logo_hn38lc" 
                alt="Krishna Academy Logo" 
                className="w-full h-full object-cover transition-transform group-hover:rotate-12"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-brand-blue font-black text-2xl">K</span>';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl leading-none tracking-tighter uppercase">KRISHNA</span>
              <span className="text-brand-yellow text-[10px] font-black tracking-[0.2em] leading-none uppercase mt-1">NEET/JEE ACADEMY</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {['Home', 'Courses', 'Features', 'Contact'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-white/70 hover:text-brand-yellow font-bold text-sm uppercase tracking-widest transition-all cursor-pointer relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-yellow transition-all group-hover:w-full" />
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('lead-form')}
              className="btn-premium !py-3 !px-8 !text-sm"
            >
              Enroll Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 bg-brand-blue z-50 flex flex-col p-10 md:hidden"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/djcl2t35x/image/upload/f_auto,q_auto/logo_hn38lc" 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<span class="text-brand-blue font-black text-2xl">K</span>';
                        }
                      }}
                    />
                  </div>
                  <span className="text-white font-black text-xl uppercase tracking-tighter">KRISHNA</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
                  <X size={40} />
                </button>
              </div>
              <div className="flex flex-col gap-8">
                {['Home', 'Courses', 'Features', 'Contact'].map((item, idx) => (
                  <motion.button 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={item} 
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-white text-5xl font-black uppercase tracking-tighter text-left"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
              <div className="mt-auto">
                <button 
                  onClick={() => scrollToSection('lead-form')}
                  className="btn-premium w-full !py-6 !text-xl"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 bg-brand-blue overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(250,204,21,0.1)_0%,_transparent_50%)] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* Promotional Banner Component */}
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-12 mb-12 lg:mb-20 relative group animate-tilt"
          >
            {/* Animated Glow Background - Enhanced with more vibrant colors */}
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-yellow/40 via-blue-400/40 to-brand-yellow/40 rounded-[2.5rem] blur-3xl opacity-40 group-hover:opacity-80 transition duration-1000"></div>
            
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-brand-blue/60 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
              {/* Animated Gradient Border Overlay - More visible */}
              <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-brand-yellow via-blue-500 to-brand-yellow animate-gradient-border"></div>
              
              {/* Glass Reflection Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Decorative inner glow - Top and Bottom */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-yellow/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              <div className="p-6 lg:p-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 relative z-10">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 bg-brand-yellow/20 border border-brand-yellow/40 px-5 py-2 rounded-full mb-8 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                    <span className="text-brand-yellow text-xs font-black uppercase tracking-[0.25em]">🔥 Admissions Open 2026</span>
                  </div>
                  
                  <h2 className="text-4xl lg:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.85]">
                    EAPCET <span className="text-brand-yellow mx-2">•</span> NEET <span className="text-brand-yellow mx-2">•</span> JEE <br />
                    <span className="text-brand-yellow drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">Elite Coaching</span>
                  </h2>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8 mb-12">
                    <div className="flex flex-col">
                      <p className="text-white font-black text-2xl uppercase tracking-tighter leading-tight">Admissions Open</p>
                      <p className="text-brand-yellow/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 max-w-[300px] mx-auto lg:mx-0">Limited Intake Program</p>
                    </div>
                    <div className="hidden lg:block w-px h-16 bg-white/20"></div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-3 rounded-2xl backdrop-blur-xl shadow-inner">
                        <span className="text-brand-yellow text-xs font-black uppercase tracking-widest">Scalar Batch (8:00 AM – 2:00 PM)</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                        <div className="flex items-center gap-2">
                          <span className="text-white text-[10px] font-black tracking-tighter uppercase mr-1">12 Left</span>
                          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '75%' }}
                              transition={{ duration: 1.5, delay: 0.2 }}
                              className="h-full bg-brand-yellow"
                            />
                          </div>
                          <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest italic">Filling Fast</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-3 rounded-2xl backdrop-blur-xl shadow-inner">
                        <span className="text-brand-yellow text-xs font-black uppercase tracking-widest">Vector Batch (8:00 AM – 8:00 PM)</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                        <div className="flex items-center gap-2">
                          <span className="text-white text-[10px] font-black tracking-tighter uppercase mr-1">8 Left</span>
                          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '85%' }}
                              transition={{ duration: 1.5, delay: 0.4 }}
                              className="h-full bg-brand-yellow"
                            />
                          </div>
                          <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest italic">Almost Full</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      { text: 'Daily Tests', icon: <CheckCircle2 size={22} />, desc: 'Rigorous Practice' },
                      { text: 'Expert Faculty', icon: <CheckCircle2 size={22} />, desc: 'Elite Mentorship' },
                      { text: 'Rank Booster', icon: <CheckCircle2 size={22} />, desc: 'Score Optimization' }
                    ].map((item, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(250,204,21,0.3)' }}
                        className="flex items-center gap-5 bg-white/5 border border-white/10 p-5 rounded-[1.5rem] transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center text-brand-yellow shadow-inner">
                          {item.icon}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-white font-black text-sm uppercase tracking-tight">{item.text}</span>
                          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">{item.desc}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Right Content (CTA) */}
                <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-8">
                  <div className="relative group/btn">
                    <div className="absolute -inset-2 bg-brand-yellow blur-xl opacity-30 group-hover/btn:opacity-60 transition duration-500"></div>
                    <button 
                      onClick={() => scrollToSection('lead-form')}
                      className="relative bg-brand-yellow text-brand-blue px-12 py-6 rounded-[2rem] font-black text-2xl uppercase tracking-tighter flex items-center justify-center gap-4 hover:scale-105 transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(250,204,21,0.4)]"
                    >
                      Book Seat Now
                      <ArrowRight size={28} className="group-hover/btn:translate-x-3 transition-transform duration-300" />
                    </button>
                  </div>
                  
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <h1 className="text-[12vw] lg:text-[7.5rem] text-display text-white mb-8">
              Master <br />
              <span className="gradient-text">NEET & JEE</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/50 font-light leading-relaxed mb-12 max-w-2xl">
              Experience the <span className="text-white font-bold">Vector 4D Methodology</span>. A premium coaching ecosystem designed for elite performance in competitive exams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => scrollToSection('lead-form')}
                className="btn-premium group"
              >
                <span className="flex items-center gap-3">
                  Start Your Journey
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              <a 
                href="tel:+919704727292"
                className="btn-outline"
              >
                Speak with Experts
              </a>
            </div>

            <div className="mt-20 flex flex-wrap gap-12">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white">98%</span>
                <span className="text-white/40 text-xs uppercase tracking-widest mt-1">Success Rate</span>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white">5+</span>
                <span className="text-white/40 text-xs uppercase tracking-widest mt-1">Years Excellence</span>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white">30</span>
                <span className="text-white/40 text-xs uppercase tracking-widest mt-1">Top Ranks</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              <img 
                src="https://lh3.googleusercontent.com/p/AF1QipMRUkEVCiqoIwpHi_59XYqBiQOcnCR8wAEvR02b=s1000" 
                alt="Krishna Academy Excellence" 
                className="w-full h-full object-cover animate-float"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-yellow rounded-full flex items-center justify-center shadow-2xl animate-float [animation-delay:1s]">
              <Star className="text-brand-blue fill-brand-blue" size={48} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlight Strip */}
      <div className="bg-brand-yellow py-4 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="text-brand-blue font-black text-xl uppercase tracking-tighter">Classes Begin: March 20, 2026</span>
              <div className="w-2 h-2 bg-brand-blue rounded-full" />
              <span className="text-brand-blue font-black text-xl uppercase tracking-tighter">Admissions Open for Short-Term 2026</span>
              <div className="w-2 h-2 bg-brand-blue rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <section id="courses" className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-brand-yellow font-black tracking-[0.3em] uppercase text-xs mb-6">Our Programs</h2>
              <h3 className="text-5xl md:text-7xl font-black text-brand-blue leading-[0.9] tracking-tighter uppercase">
                Specialized <br />
                <span className="text-slate-300">Coaching Tracks</span>
              </h3>
            </div>
            <p className="text-slate-500 text-lg max-w-sm font-light">
              Tailored curriculum designed to bridge the gap between school education and competitive excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              { 
                title: "BiPC Stream", 
                icon: <BookOpen size={40} />, 
                desc: "Comprehensive coaching for NEET & EAPCET. Focus on Biology, Physics, and Chemistry with intensive practical problem solving.",
                features: ['Daily Practice Papers', 'NCERT Focused Learning', 'Weekly Mock Tests']
              },
              { 
                title: "MPC Stream", 
                icon: <Layout size={40} />, 
                desc: "Expert guidance for EAPCET. Advanced Mathematics and Physics concepts simplified for maximum score potential.",
                features: ['Shortcut Techniques', 'Previous Year Analysis', 'Conceptual Clarity']
              }
            ].map((course, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -20 }}
                className="bg-white p-12 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-slate-100 group transition-all duration-500"
              >
                <div className="w-20 h-20 bg-brand-blue rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-brand-yellow group-hover:rotate-12 transition-all duration-500">
                  <div className="text-brand-yellow group-hover:text-brand-blue transition-colors">
                    {course.icon}
                  </div>
                </div>
                <h4 className="text-4xl font-black mb-6 uppercase tracking-tighter">{course.title}</h4>
                <p className="text-slate-500 text-xl font-light mb-10 leading-relaxed">
                  {course.desc}
                </p>
                <div className="space-y-4 mb-12">
                  {course.features.map((item) => (
                    <div key={item} className="flex items-center gap-4 text-slate-700 font-bold">
                      <div className="w-2 h-2 bg-brand-yellow rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => scrollToSection('lead-form')} 
                  className="flex items-center gap-4 text-brand-blue font-black uppercase tracking-widest text-sm hover:gap-6 transition-all cursor-pointer group/btn"
                >
                  Explore Curriculum 
                  <ArrowRight size={20} className="text-brand-yellow group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-brand-blue text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,_white_0%,_transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-brand-yellow font-black tracking-[0.3em] uppercase text-xs mb-6">Why Choose Us</h2>
              <h3 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase mb-12">
                Excellence <br />
                <span className="text-white/30">In Every Aspect</span>
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: <Clock size={32} />, title: "Time Mastery", desc: "Master the art of solving complex questions under extreme pressure." },
                  { icon: <Layout size={32} />, title: "Grand Tests", desc: "Full-length mock exams mimicking actual patterns and difficulty." },
                  { icon: <BookOpen size={32} />, title: "PYQ Analysis", desc: "Strategic in-depth study of previous year question trends." },
                  { icon: <Users size={32} />, title: "Elite Mentoring", desc: "One-on-one doubt clearing and psychological mentoring." }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className="text-brand-yellow mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                    <h4 className="font-black text-2xl mb-3 uppercase tracking-tighter">{feature.title}</h4>
                    <p className="text-white/40 text-sm font-light leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-brand-yellow p-12 md:p-16 rounded-[4rem] text-brand-blue relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                
                <h4 className="text-5xl font-black mb-8 uppercase leading-none tracking-tighter">Vector <br /> 4D Method</h4>
                <div className="space-y-6 mb-12">
                  {[
                    { n: '01', t: 'Depth of Concept' },
                    { n: '02', t: 'Speed of Execution' },
                    { n: '03', t: 'Accuracy of Application' },
                    { n: '04', t: 'Psychological Resilience' }
                  ].map(item => (
                    <div key={item.n} className="flex items-center gap-6">
                      <span className="text-2xl font-black opacity-20">{item.n}</span>
                      <span className="text-xl font-black uppercase tracking-tight">{item.t}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-brand-blue text-white p-8 rounded-3xl flex items-center gap-6 shadow-2xl">
                  <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center text-brand-blue shrink-0">
                    <GraduationCap size={32} />
                  </div>
                  <div>
                    <div className="font-black uppercase tracking-tighter text-lg">Proven Success</div>
                    <div className="text-white/40 text-xs uppercase tracking-widest mt-1">Used by top 100 rankers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hostel Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-slate-50">
                <img 
                  src="https://lh3.googleusercontent.com/p/AF1QipO5dTva128I2AMchZg0DPJwy1OLl5yzi5k5F2ng=s1000" 
                  alt="Krishna Academy Residential Facility and Hostel" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-brand-blue text-white p-10 rounded-[3rem] shadow-2xl hidden md:block">
                <div className="text-5xl font-black text-brand-yellow mb-2">24/7</div>
                <div className="text-xs uppercase tracking-[0.3em] font-black">Security & Support</div>
              </div>
            </motion.div>
            
            <div className="lg:pl-10">
              <h2 className="text-brand-yellow font-black tracking-[0.3em] uppercase text-xs mb-6">Life at Krishna</h2>
              <h3 className="text-5xl md:text-7xl font-black text-brand-blue leading-[0.9] tracking-tighter uppercase mb-10">
                Premium <br />
                <span className="text-slate-300">Residential Care</span>
              </h3>
              <p className="text-slate-500 text-xl font-light mb-12 leading-relaxed">
                We provide a secure, study-optimized ecosystem. Our residential facilities are designed to eliminate distractions and maximize academic focus.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { t: 'Nutritious Food', d: 'Hygienic home-style meals' },
                  { t: 'Study Halls', d: 'Quiet zones for deep focus' },
                  { t: '24/7 Security', d: 'CCTV & warden supervision' },
                  { t: 'Clean Rooms', d: 'Spacious & well-ventilated' }
                ].map((item) => (
                  <div key={item.t} className="group">
                    <div className="text-brand-blue font-black uppercase tracking-tight text-lg mb-2 group-hover:text-brand-yellow transition-colors">{item.t}</div>
                    <div className="text-slate-400 text-sm font-light">{item.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,_#000_0,_#000_1px,_transparent_0,_transparent_50%)] bg-[length:20px_20px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
            <div className="max-w-3xl">
              <h2 className="text-brand-yellow font-black tracking-[0.3em] uppercase text-xs mb-6">Success Stories</h2>
              <h3 className="text-6xl md:text-8xl font-black text-brand-blue leading-[0.85] tracking-tighter uppercase">
                Voices of <br />
                <span className="text-slate-200">Excellence</span>
              </h3>
            </div>
            <div className="flex flex-col items-start lg:items-end text-left lg:text-right">
              <div className="flex gap-1 text-brand-yellow mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">4.9/5 Based on 100+ Google Reviews</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Hruday Sattenapalli", 
                review: "The best tution centre in guntur. Dr Krishna Reddy Sir, M Sc, BEd, M Tech, PhD describes the standards of the institution. Talented faculty with Discipline and Principles, trying to enhance the skills of each individual student. Thanks for the support and guidance to the Students. 🙏", 
                meta: "5 Reviews • 3 Months Ago"
              },
              { 
                name: "Hemalatha Mikkili", 
                review: "Nice faculty. Teaching is very good. All teachers will be friendly with students and help them in clarifying their doubts.", 
                meta: "3 Reviews • 6 Months Ago"
              },
              { 
                name: "Kandru Mary Hema latha", 
                review: "The best tuition center in guntur.very help full for IIT based students. The give explanation with the qualified faculty.", 
                meta: "1 Review • 3 Months Ago"
              }
            ].map((t, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col h-full"
              >
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex-1 flex flex-col relative group hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500">
                  <div className="absolute top-8 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote size={60} />
                  </div>
                  
                  <div className="flex gap-1 text-brand-yellow mb-8">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  
                  <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10 flex-1">
                    "{t.review}"
                  </p>
                  
                  <div className="pt-8 border-t border-slate-200 mt-auto">
                    <div className="font-black text-brand-blue uppercase tracking-tight text-xl">{t.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.meta}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="lead-form" className="section-padding bg-brand-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,_white_0%,_transparent_50%)]" />
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-yellow" />
            
            <h3 className="text-5xl md:text-7xl font-black text-brand-blue mb-6 uppercase tracking-tighter leading-[0.9]">
              Join the <br />
              <span className="text-slate-300">Elite Batch</span>
            </h3>
            <p className="text-slate-500 mb-16 text-xl font-light max-w-xl mx-auto">Experience our expert teaching style before you enroll. Limited slots available for the 2026 session.</p>
            
            <form onSubmit={handleFormSubmit} className="max-w-md mx-auto space-y-6">
              <div className="relative group">
                <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-blue/50 group-focus-within:text-brand-yellow transition-colors" size={24} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="FULL NAME" 
                  required
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-brand-yellow/20 focus:bg-white transition-all font-bold uppercase tracking-widest text-sm"
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-blue/50 group-focus-within:text-brand-yellow transition-colors" size={24} />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="PHONE NUMBER" 
                  required
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-brand-yellow/20 focus:bg-white transition-all font-bold uppercase tracking-widest text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={formStatus !== 'idle'}
                className={`btn-premium w-full !py-6 !text-lg ${formStatus === 'success' ? 'bg-green-500 text-white shadow-none' : ''}`}
              >
                {formStatus === 'idle' && 'Reserve My Seat'}
                {formStatus === 'submitting' && 'Processing...'}
                {formStatus === 'success' && 'Success! We will call you.'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24">
            <div>
              <h3 className="text-5xl md:text-7xl font-black text-brand-blue leading-[0.9] tracking-tighter uppercase mb-16">
                Get In <br />
                <span className="text-slate-300">Touch</span>
              </h3>
              
              <div className="space-y-12">
                {[
                  { icon: <Phone size={32} />, label: 'Call Us', value: '+91 9704727292', href: 'tel:+919704727292' },
                  { icon: <MapPin size={32} />, label: 'Our Location', value: 'Pattabhipuram Main Road, Guntur', href: '#' },
                  { icon: <Clock size={32} />, label: 'Working Hours', value: 'Mon - Sat: 8:00 AM - 8:00 PM', href: '#' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 group">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-yellow group-hover:rotate-12 transition-all duration-500">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-brand-yellow text-xs font-black uppercase tracking-[0.3em] mb-2">{item.label}</div>
                      {item.href !== '#' ? (
                        <a href={item.href} className="text-2xl md:text-3xl font-black text-brand-blue hover:text-brand-yellow transition-colors uppercase tracking-tight">{item.value}</a>
                      ) : (
                        <div className="text-2xl md:text-3xl font-black text-brand-blue uppercase tracking-tight">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-slate-50 h-[600px] relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3829.176472445588!2d80.4133381116499!3d16.31200548432924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x837733d9cdd87ebd%3A0xca9a632d2b4468!2sKRISHNA%20TUITIONS%20%26%20NEET%2FIIT%20ACADEMY%20EAPCET%2FEAMCET(Dr.%20D%20V%20Krishna%20Sir&#39;s)!5e0!3m2!1sen!2sin!4v1711360000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full transition-all duration-1000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue text-white pt-32 pb-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-20 mb-32">
            <div className="md:col-span-6">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-brand-yellow rounded-[1.5rem] flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/djcl2t35x/image/upload/f_auto,q_auto/logo_hn38lc" 
                    alt="Krishna Academy Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-brand-blue font-black text-3xl">K</span>';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black leading-none tracking-tighter uppercase">KRISHNA</span>
                  <span className="text-brand-yellow text-xs font-black tracking-[0.3em] leading-none uppercase mt-2">NEET/JEE ACADEMY</span>
                </div>
              </div>
              <p className="text-white/40 text-xl font-light max-w-md leading-relaxed mb-12">
                Empowering the next generation of medical and engineering professionals with elite coaching and unwavering dedication.
              </p>
              <div className="flex gap-6">
                {['FB', 'IG', 'TW', 'YT'].map(social => (
                  <div key={social} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xs hover:bg-brand-yellow hover:text-brand-blue transition-all cursor-pointer">
                    {social}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-brand-yellow font-black uppercase tracking-[0.3em] text-xs mb-10">Navigation</h4>
              <ul className="space-y-6">
                {['Home', 'Courses', 'Features', 'Contact'].map(link => (
                  <li key={link}>
                    <button 
                      onClick={() => scrollToSection(link.toLowerCase())} 
                      className="text-white/40 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors cursor-pointer"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-brand-yellow font-black uppercase tracking-[0.3em] text-xs mb-10">Legal</h4>
              <ul className="space-y-6 text-white/40 font-bold uppercase tracking-widest text-sm">
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-white transition-colors">Refund Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-xs font-black uppercase tracking-[0.4em]">
            <span>© 2026 KRISHNA NEET/JEE ACADEMY</span>
            <span>Crafted for Excellence</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919704727292?text=*I'm%20ready%20to%20aim%20for%20the%20top!*%0A%0AI'd%20love%20to%20learn%20more%20about%20the%20programs%20at%20*Krishna%20Academy*.%20Please%20share%20the%20details!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-bounce-slow"
      >
        <MessageCircle size={32} fill="currentColor" />
      </a>

      {/* Scroll to Top/Bottom Arrows */}
      <div className="fixed bottom-44 right-6 md:bottom-28 md:right-8 z-40 flex flex-col gap-3">
        <button 
          onClick={scrollToTop}
          className="bg-brand-blue text-white p-3 rounded-xl shadow-2xl hover:bg-brand-yellow hover:text-brand-blue transition-all hover:scale-110 border border-white/10"
          title="Scroll to Top"
        >
          <ChevronUp size={24} />
        </button>
        <button 
          onClick={scrollToBottom}
          className="bg-brand-blue text-white p-3 rounded-xl shadow-2xl hover:bg-brand-yellow hover:text-brand-blue transition-all hover:scale-110 border border-white/10"
          title="Scroll to Bottom"
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-3 grid grid-cols-2 gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <a 
          href="tel:+919704727292"
          className="bg-brand-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Phone size={18} />
          Call Now
        </a>
        <a 
          href="https://wa.me/919704727292?text=*I'm%20ready%20to%20aim%20for%20the%20top!*%0A%0AI'd%20love%20to%20learn%20more%20about%20the%20programs%20at%20*Krishna%20Academy*.%20Please%20share%20the%20details!"
          className="bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} fill="currentColor" />
          Chat Now
        </a>
      </div>

      {/* AI Chatbot Persistent Icon */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-24 left-6 md:bottom-8 md:left-8 z-40 bg-brand-blue text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-brand-yellow"
      >
        <Users size={32} />
        <span className="absolute -top-2 -right-2 bg-brand-yellow text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">AI</span>
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 left-6 right-6 md:bottom-24 md:left-8 md:right-auto md:w-96 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden h-[500px]"
          >
            {/* Chat Header */}
            <div className="bg-brand-blue p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-brand-blue">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Academy Assistant</div>
                  <div className="text-brand-yellow text-[10px] font-bold uppercase tracking-wider">Online Support</div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/60 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-blue text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    <div className="whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about courses, fees..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
              <button 
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className="bg-brand-yellow text-brand-blue p-2 rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
