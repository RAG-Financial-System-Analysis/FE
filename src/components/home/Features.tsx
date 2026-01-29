import { FileUp, Search, BarChart3, Lightbulb } from 'lucide-react';

const Features = () => {
    const features = [
        {
            id: "01",
            icon: <FileUp size={24} />,
            title: "Financial Report Upload",
            desc: "Seamlessly upload corporate financial statements in PDF. Our system handles the heavy lifting of parsing data."
        },
        {
            id: "02",
            icon: <Search size={24} />,
            title: "Smart Extraction",
            desc: "Identify key financial information using structured accounting data assessment for maximum accuracy."
        },
        {
            id: "03",
            icon: <BarChart3 size={24} />,
            title: "Ratios & Performance",
            desc: "Evaluate profitability, liquidity, and performance metrics across multiple periods with a single click."
        },
        {
            id: "04",
            icon: <Lightbulb size={24} />,
            title: "Insights & Interpretation",
            desc: "Clear, human-readable insights based strictly on reported data. No more guessing what the numbers mean."
        }
    ];

    return (
        <section id="features" className="bg-[#0A1121] py-40 relative overflow-hidden">
            {/* Deep blue gradient background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(27,44,79,1)_0%,rgba(10,17,33,1)_100%)] opacity-50"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-white font-outfit font-bold text-4xl md:text-5xl mb-6 tracking-tight">Powerful suite for <span className="text-blue-400">modern</span> analysis.</h2>
                        <p className="text-gray-400 font-light text-lg">Every tool you need to dissect corporate financial health in one place.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, idx) => (
                        <div
                            key={f.id}
                            className="relative group h-full"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/20 to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[32px] h-full flex flex-col hover:border-white/20 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 transition-transform group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white duration-500">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-outfit font-bold text-white mb-4 leading-tight">{f.title}</h3>
                                <p className="text-gray-400 text-sm font-light leading-relaxed">{f.desc}</p>

                                <div className="mt-auto pt-8 flex items-center justify-between">
                                    <span className="text-white/10 font-outfit font-black text-4xl tracking-tighter group-hover:text-white/20 transition-colors uppercase">{f.id}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dynamic shape footer transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
        </section>
    );
};

export default Features;
