import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import ProblemSolution from "@/components/home/ProblemSolution";
import Features from "@/components/home/Features";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";

const Home = () => {
    return (
        <div className="min-h-screen font-sans bg-white selection:bg-primary/20 bg-mesh relative">
            {/* Decorative Floating Shapes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px] animate-drift"></div>
                <div className="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-drift" style={{ animationDirection: 'reverse' }}></div>
            </div>

            <div className="relative z-10">
                <Navbar />
                <Hero />
                <ProblemSolution />
                <Features />
                <Contact />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
