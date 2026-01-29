import heroBg from '../../assets/hero_bg.png';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Server, ShieldCheck } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen pt-20 flex items-center overflow-hidden bg-[#fafafa]">
            {/* Decorative blurred blobs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-8 border border-primary/10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Powered by Advanced AI
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-outfit font-bold text-primary mb-8 leading-[1.1] tracking-tight">
                            Demystifying <span className="text-blue-600">Financial</span> Intelligence.
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl font-light max-w-xl mb-12 leading-relaxed">
                            Transform complex corporate statements into clear, actionable insights with our academic-grade analysis platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <Button className="bg-primary hover:bg-primary-dark text-white px-10 h-16 rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group">
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <button className="flex items-center gap-3 px-8 h-16 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold transition-all hover:border-gray-300">
                                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                    <Play size={14} fill="currentColor" />
                                </div>
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-16 flex items-center gap-10 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                            <div className="flex items-center gap-2 font-outfit font-bold text-sm"><ShieldCheck size={20} /> Enterprise Secure</div>
                            <div className="flex items-center gap-2 font-outfit font-bold text-sm"><Server size={20} /> Real-time Data</div>
                        </div>
                    </div>

                    {/* Right Visual - Boxed Image */}
                    <div className="relative group animate-fade-in-up delay-300">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-blue-400/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="aspect-[4/3] rounded-[32px] overflow-hidden">
                                <img
                                    src={heroBg}
                                    alt="Financial Dashboard"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                            </div>
                            {/* Floating Metric */}
                            <div className="absolute top-12 right-12 bg-white/90 backdrop-blur shadow-xl p-5 rounded-2xl border border-gray-100 animate-bounce-slow">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Accuracy</div>
                                <div className="text-2xl font-bold text-primary font-outfit">99.8%</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
