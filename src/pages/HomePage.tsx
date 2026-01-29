import {
  BarChart3,
  Calculator,
  Scale,
  Wallet,
  Building2,
  GitBranch,
  Activity,
  Sparkles,
  FileText,
  Code,
  Users,
  Gavel,
} from "lucide-react";

function HomePage() {
  // ❌ remove: const navigate = useNavigate();

  const problems = [
    {
      icon: Calculator,
      title: "Manual Computational Constraints",
      description:
        "Heavy reliance on manual data entry from PDF disclosures leads to increased error rates and significant time loss during the aggregation phase of longitudinal studies.",
    },
    {
      icon: Scale,
      title: "Inconsistency in Ratio Application",
      description:
        "Variations in component selection for formulas (e.g., EBIT vs. EBITDA) across different researchers compromise the empirical validity of comparative cross-industry studies.",
    },
  ];

  const capabilities = [
    {
      icon: Wallet,
      title: "Income Statement",
      description: "Comprehensive P&L scrutiny with vertical and horizontal trend normalization.",
    },
    {
      icon: Building2,
      title: "Balance Sheet",
      description: "Asset-liability equilibrium analysis and working capital cycle evaluation.",
    },
    {
      icon: GitBranch,
      title: "Cash Flow",
      description: "Direct and indirect tracking of operating, investing, and financing activities.",
    },
    {
      icon: Activity,
      title: "Ratio Analysis",
      description: "Advanced heuristic evaluation covering 45+ standardized financial metrics.",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Raw Financial Data",
      description: "Ingest XBRL filings, PDF reports, or CSV ledger exports.",
    },
    {
      step: 2,
      title: "Standardized Ratios",
      description: "Automated mapping to GAAP/IFRS taxonomy for uniform calculation.",
    },
    {
      step: 3,
      title: "AI Theoretical Interpretation",
      description: "Heuristic-driven qualitative synthesis of financial performance.",
      highlighted: true,
    },
  ];

  const chartBars = [
    { height: "60%", opacity: "20" },
    { height: "75%", opacity: "40" },
    { height: "85%", opacity: "60" },
    { height: "70%", opacity: "80" },
    { height: "95%", opacity: "100" },
  ];

  const footerLinks = [
    "IFRS S1 & S2 Compliance",
    "GAAP Taxonomy",
    "XBRL Data Mapping",
    "Ethical AI Framework",
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#111921] text-[#0e141b] dark:text-slate-50">
      {/* Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] dark:border-b-slate-700 px-10 py-3 bg-white dark:bg-[#111921] sticky top-0 z-50">
        <div className="flex items-center gap-4 text-[#1773cf]">
          <BarChart3 className="w-6 h-6" />
          <h2 className="text-[#0e141b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Financial Analysis
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <a className="text-[#0e141b] dark:text-white text-md font-medium leading-normal hover:text-primary transition-colors" href="#">Methodology</a>
          <a className="text-[#0e141b] dark:text-white text-md font-medium leading-normal hover:text-primary transition-colors" href="#">IFRS/GAAP Standards</a>
          <a className="text-[#0e141b] dark:text-white text-md font-medium leading-normal hover:text-primary transition-colors" href="#">Research</a>
          <a className="text-[#0e141b] dark:text-white text-md font-medium leading-normal hover:text-primary transition-colors" href="#">Documentation</a>
        </div>
        <div className="flex gap-2">
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7edf3] dark:bg-slate-700 text-[#0e141b] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d0dbe7] dark:hover:bg-slate-600 transition-colors">
            <span className="truncate">Get Started</span>
          </button>
          <a
            href="/login"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7edf3] dark:bg-slate-700 text-[#0e141b] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d0dbe7] dark:hover:bg-slate-600 transition-colors"
          >
            <span className="truncate">Log In</span>
          </a>
        </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1773cf_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6">
            RAG Financial Statement Analysis System 
          </h1>
          <p className="text-slate-300 text-lg font-normal leading-relaxed max-w-2xl mx-auto mb-10">
            Empowering academic research with quantitative precision through automated financial evaluation and standardized ratio heuristics.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#1773cf] text-[#1773cf] text-base font-bold transition-all hover:bg-[#125ea8] hover:scale-105 shadow-lg shadow-[#1773cf]/30">
              Start Free Analysis
            </button>
            <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white/10 backdrop-blur-sm border-2 border-[#1773cf] text-[#1773cf] text-base font-bold hover:bg-[#1773cf]/20 transition-colors">
              View Methodology
            </button>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="max-w-[1200px] mx-auto w-full px-10 py-20">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 border-l-4 border-[#1773cf] pl-6">
            <h2 className="text-[#0e141b] dark:text-white text-3xl font-black leading-tight tracking-tight">
              Analytical Challenges in Financial Statement Interpretation
            </h2>
            <p className="text-[#4e7397] dark:text-slate-400 text-lg max-w-3xl">
              Traditional research methods often struggle with scalability and rigor. Our system addresses these systemic barriers to empirical validity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="flex gap-6 rounded-xl border border-[#d0dbe7] dark:border-slate-700 bg-white dark:bg-slate-800 p-8"
              >
                <div className="bg-[#1773cf]/10 p-3 rounded-lg h-fit">
                  <problem.icon className="w-7 h-7 text-[#1773cf]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0e141b] dark:text-white text-xl font-bold">
                    {problem.title}
                  </h3>
                  <p className="text-[#4e7397] dark:text-slate-400 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20">
        <div className="max-w-[1200px] mx-auto px-10">
          <h2 className="text-[#0e141b] dark:text-white text-2xl font-bold mb-10 text-center uppercase tracking-widest">
            Core Analytical Capabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 border border-[#d0dbe7] dark:border-slate-700 p-6 rounded-lg transition-all hover:shadow-md hover:border-[#1773cf] cursor-pointer"
              >
                <capability.icon className="w-7 h-7 text-[#1773cf] mb-4" />
                <h4 className="text-[#0e141b] dark:text-white font-bold text-lg mb-2">
                  {capability.title}
                </h4>
                <p className="text-[#4e7397] dark:text-slate-400 text-sm">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytical Framework Process Flow */}
      <section className="py-20 max-w-[1200px] mx-auto px-10">
        <h2 className="text-[#0e141b] dark:text-white text-3xl font-black text-center mb-16">
          Standardized Analytical Framework
        </h2>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
          {processSteps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border w-full md:w-1/3 ${
                step.highlighted
                  ? "border-[#1773cf]/30 shadow-lg shadow-[#1773cf]/5"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="bg-[#1773cf] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                {step.step}
              </div>
              <h5 className="font-bold text-[#0e141b] dark:text-white">{step.title}</h5>
              <p className="text-sm text-[#4e7397] dark:text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Example Insights */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-20 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row">
            {/* Graph Area */}
            <div className="flex-1 p-8 border-r border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0e141b] dark:text-white">
                    Profitability Benchmark Analysis
                  </h3>
                  <p className="text-sm text-[#4e7397]">Sample Corp: ROE vs ROCE (5-Year Trend)</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-semibold">
                    FY2019-2023
                  </span>
                  <span className="px-3 py-1 bg-[#1773cf]/10 text-[#1773cf] rounded text-xs font-semibold uppercase">
                    Live Model
                  </span>
                </div>
              </div>
              {/* Mock Chart */}
              <div className="h-64 flex items-end gap-4 px-4 relative">
                {chartBars.map((bar, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-t transition-all hover:opacity-80`}
                    style={{
                      height: bar.height,
                      backgroundColor: `rgba(23, 115, 207, ${parseInt(bar.opacity) / 100})`,
                    }}
                  ></div>
                ))}
                {/* Comparison Line */}
                <div className="absolute inset-x-8 bottom-32 border-t-2 border-dashed border-orange-400"></div>
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-mono uppercase tracking-tighter px-4">
                <span>2019</span>
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
              </div>
            </div>
            {/* AI Sidebar Area */}
            <div className="w-full lg:w-96 bg-slate-50 dark:bg-slate-800/50 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[#1773cf]" />
                <h4 className="font-bold text-[#0e141b] dark:text-white">AI Observations</h4>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-white dark:bg-slate-700 rounded-lg border-l-4 border-[#1773cf] shadow-sm">
                  <p className="text-xs font-bold text-[#1773cf] uppercase mb-1">ROE/ROCE Convergence</p>
                  <p className="text-sm text-[#0e141b] dark:text-slate-200">
                    The narrowing gap suggests efficient capital allocation and reduced reliance on financial leverage for equity returns.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-700 rounded-lg border-l-4 border-slate-300 shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Evidence Summary</p>
                  <p className="text-sm text-[#0e141b] dark:text-slate-200">
                    Operating margins remained stable at 12.4% despite inflationary pressures in Q3.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111921] text-slate-400 py-16 px-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="flex items-center gap-3 text-white mb-6">
              <BarChart3 className="w-5 h-5" />
              <span className="font-bold text-lg">AI Financial Analysis</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Advancing financial research through open-source heuristics and machine learning integration.
            </p>
            <div className="flex gap-4">
              <a className="hover:text-white transition-colors cursor-pointer">
                <FileText className="w-5 h-5" />
              </a>
              <a className="hover:text-white transition-colors cursor-pointer">
                <Code className="w-5 h-5" />
              </a>
              <a className="hover:text-white transition-colors cursor-pointer">
                <Users className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 bg-slate-800/50 p-8 rounded-xl border border-slate-700">
            <h5 className="text-white font-bold mb-4 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-[#1773cf]" />
              Academic Disclaimer
            </h5>
            <p className="text-xs leading-relaxed text-slate-400 italic">
              The outputs generated by this system are for academic research and educational purposes only. This platform does not provide financial advice, audit opinions, or investment recommendations. All ratio calculations are performed in strict alignment with IFRS and US-GAAP standards where indicated. Researchers are encouraged to verify AI-assisted qualitative interpretations against source filings.
            </p>
          </div>
          <div className="col-span-1">
            <h5 className="text-white font-bold mb-6">Standards</h5>
            <ul className="space-y-3 text-sm">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a className="hover:text-[#1773cf] transition-colors cursor-pointer">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs gap-4">
          <p>© 2026 RAG Financial Statement Analysis System. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-white cursor-pointer">Privacy Policy</a>
            <a className="hover:text-white cursor-pointer">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;