
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Cases from "@/pages/Cases";
import AppScreenshots from "@/components/AppScreenshots";
import PublicOffer from "@/components/PublicOffer";

const Index = () => {
  return (
    <div className="min-h-screen bg-space-dark">
      <Header />
      <Hero />
      <About />
      <Cases />
      <AppScreenshots />
      
      {/* Footer с публичной офертой */}
      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm text-white/60">
              <p className="mb-2">
                Инвестиции всегда связаны с риском. Не инвестируйте последние или заемные средства.
              </p>
              <p className="mb-4">
                Оферта не предназначена для резидентов США.
              </p>
              
              {/* Публичная оферта в подвале */}
              <div className="mt-4">
                <PublicOffer />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
