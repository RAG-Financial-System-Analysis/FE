import contactBg from '../../assets/contact_bg.png';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
    return (
        <section id="contact" className="py-32 px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-outfit font-bold text-primary text-center mb-20 tracking-tight">Contact</h2>

                <div className="flex flex-col lg:flex-row shadow-[0_30px_100px_rgba(0,0,0,0.08)] rounded-[32px] overflow-hidden bg-white border border-gray-100 h-full lg:min-h-[600px]">

                    {/* Left Visual Wrapper */}
                    <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
                        <img
                            src={contactBg}
                            alt="Contact Support"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] mix-blend-multiply"></div>
                        {/* Floating Badge */}
                        <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white">
                            <p className="font-outfit font-medium text-lg leading-snug">We're here to help you unlock the power of financial data.</p>
                        </div>
                    </div>

                    {/* Right Form Container */}
                    <div className="lg:w-1/2 p-10 md:p-20 bg-[#F9FAFB] flex flex-col justify-center">
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Organization</label>
                                    <Input placeholder="Enter company name" className="bg-white border-gray-100 h-14 px-5 rounded-xl focus-visible:ring-primary/20 shadow-sm transition-all focus:scale-[1.01]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                                    <Input placeholder="name@example.com" className="bg-white border-gray-100 h-14 px-5 rounded-xl focus-visible:ring-primary/20 shadow-sm transition-all focus:scale-[1.01]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
                                <Input placeholder="+84 000 000 000" className="bg-white border-gray-100 h-14 px-5 rounded-xl focus-visible:ring-primary/20 shadow-sm transition-all focus:scale-[1.01]" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Your Message</label>
                                <Textarea
                                    placeholder="How can we assist you?"
                                    className="bg-white border-gray-100 min-h-[160px] p-5 rounded-2xl focus-visible:ring-primary/20 shadow-sm resize-none transition-all focus:scale-[1.01]"
                                />
                            </div>

                            <div className="pt-4">
                                <Button className="bg-primary hover:bg-primary-dark text-white px-12 w-full h-14 rounded-2xl text-base font-bold tracking-tight shadow-xl hover:shadow-2xl transition-all active:scale-95">
                                    Send Message
                                </Button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Contact;
