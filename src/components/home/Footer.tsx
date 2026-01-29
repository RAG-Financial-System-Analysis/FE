import { Facebook, Instagram, Twitter, Chrome, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="footer" className="bg-[#1B2C4F] text-white pt-24 pb-12 px-6 md:px-10 lg:px-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">

                {/* About / Mission */}
                <div className="lg:col-span-5 pr-0 lg:pr-20">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
                        </div>
                        <span className="font-outfit font-bold text-xl tracking-tight">FinanceAI</span>
                    </div>
                    <p className="text-blue-100/60 leading-relaxed font-light text-[14px] mb-8">
                        We are dedicated to humanizing complex financial data. Our AI-driven platform empowers students and professionals to unlock deep corporate insights through intuitive analysis and structured reporting.
                    </p>
                    <button className="group flex items-center gap-3 bg-white/10 hover:bg-white text-white hover:text-primary px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300">
                        Explore Insights
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Quick Links Group */}
                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                    {/* Address */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg font-outfit">Our Office</h4>
                        <div className="text-blue-100/50 space-y-2 text-[14px]">
                            <p>123 Finance Street</p>
                            <p>Ho Chi Minh City, VN</p>
                        </div>
                    </div>

                    {/* Contacts */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg font-outfit">Get in Touch</h4>
                        <div className="text-blue-100/50 space-y-2 text-[14px]">
                            <p className="hover:text-white transition-colors cursor-pointer">finance.ai@academic.edu</p>
                            <p className="hover:text-white transition-colors cursor-pointer">+84 123 456 789</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg font-outfit">Resources</h4>
                        <ul className="text-blue-100/50 space-y-3 text-[14px] font-light">
                            <li><a href="#" className="hover:text-white transition-colors">Financial Analysis</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Risk Assessment</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Social & Legal Bottom Bar */}
            <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-blue-100/30 text-[13px] font-light">
                    &copy; {currentYear} FinanceAI. All rights reserved.
                </p>
                <div className="flex gap-8">
                    {[Chrome, Facebook, Instagram, Twitter].map((Icon, idx) => (
                        <a key={idx} href="#" className="text-blue-100/30 hover:text-white transition-all transform hover:scale-110">
                            <Icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
