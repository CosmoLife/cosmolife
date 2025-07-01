
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Cases from "@/pages/Cases";
import PublicOffer from "@/components/PublicOffer";

const Index = () => {
  return (
    <div className="min-h-screen bg-space-dark">
      <Header />
      <Hero />
      <About />
      <Cases />
      <PublicOffer />
      
      {/* Footer */}
      <footer id="contacts" className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 bg-neon-gradient bg-clip-text text-transparent neon-text">
              Контакты
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-white/80">
                <h3 className="text-xl font-bold text-cosmo-blue mb-4">CosmoLab и CosmoFund</h3>
                <p className="mb-2">IT-гигант и фонд с офисами в Америке, Азии, Европе, СНГ</p>
                <p>и командами разработчиков по всему миру (более 150 специалистов)</p>
              </div>
              
              <div className="text-white/80">
                <h3 className="text-xl font-bold text-cosmo-purple mb-4">Социальные сети</h3>
                <div className="space-y-2">
                  <a href="https://t.me/cosmofund" className="block hover:text-cosmo-blue transition-colors">
                    Telegram: @cosmofund
                  </a>
                  <a href="https://wa.me/77777777777" className="block hover:text-cosmo-green transition-colors">
                    WhatsApp: +7 777 777 77 77
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-white/60 border-t border-white/10 pt-8">
              <p className="mb-2">
                Инвестиции всегда связаны с риском. Не инвестируйте последние или заемные средства.
              </p>
              <p>
                Оферта не предназначена для резидентов США.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
