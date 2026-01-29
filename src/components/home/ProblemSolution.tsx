import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const ProblemSolution = () => {
    return (
        <section id="solution" className="py-32 px-6 md:px-10 bg-white relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.03]">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0, 50 0, 100 100 Z" fill="url(#grad)" />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%?" y2="0%">
                            <stop offset="0%" stopColor="#1B2C4F" />
                            <stop offset="100%" stopColor="#2A4069" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-outfit font-bold text-primary mb-6">Our Mission</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Bridging the gap between complex financial data and actionable insights for educational excellence.
                    </p>
                </div>

                <div className="grid lg:grid-cols-11 gap-8 items-center">

                    {/* Problem Side */}
                    <div className="lg:col-span-5">
                        <div className="group bg-[#FFF9F9] border border-red-100/50 p-10 md:p-14 rounded-[40px] shadow-[0_20px_50px_rgba(255,0,0,0.02)] transition-all hover:shadow-[0_30px_60px_rgba(255,0,0,0.05)] h-full">
                            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-8 text-red-500 shadow-sm transition-transform group-hover:scale-110">
                                <AlertCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-outfit font-bold text-primary mb-6">The Challenge</h3>
                            <p className="text-gray-600 font-light leading-relaxed mb-8">
                                Financial statements often feel like a labyrinth of accounting jargon and dense numbers. For students and beginners, this complexity creates a significant barrier to understanding corporate health and performance.
                            </p>
                            <div className="flex items-center gap-3 text-red-400 font-semibold text-sm">
                                <span className="w-8 h-[2px] bg-red-200"></span>
                                Complexity Barrier
                            </div>
                        </div>
                    </div>

                    {/* Central Connector Arrow */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/20">
                            <ArrowRight size={32} />
                        </div>
                    </div>

                    {/* Solution Side */}
                    <div className="lg:col-span-5">
                        <div className="group bg-[#F9FBFF] border border-blue-100/50 p-10 md:p-14 rounded-[40px] shadow-[0_20px_50px_rgba(0,100,255,0.02)] transition-all hover:shadow-[0_30px_60px_rgba(0,100,255,0.05)] h-full">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-sm transition-transform group-hover:scale-110">
                                <CheckCircle2 size={28} />
                            </div>
                            <h3 className="text-2xl font-outfit font-bold text-primary mb-6">Our AI Solution</h3>
                            <p className="text-gray-600 font-light leading-relaxed mb-8">
                                Our platform automates data extraction and applies advanced AI to calculate key indicators instantly. We provide clear, plain-language explanations that demystify financial reports, making analysis accessible to everyone.
                            </p>
                            <div className="flex items-center gap-3 text-primary font-semibold text-sm">
                                <span className="w-8 h-[2px] bg-primary/20"></span>
                                Accessible Analysis
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
