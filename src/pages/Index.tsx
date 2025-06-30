
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import PublicOffer from '@/components/PublicOffer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-neon-gradient bg-clip-text text-transparent neon-text">
              Начни инвестировать уже сегодня
            </h2>
            <p className="text-xl text-white/80 mb-12">
              Присоединяйся к революции в мире технологий и получай стабильный доход от инвестиций в будущее
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-6 px-12 text-xl neon-border animate-neon-pulse"
                >
                  Инвестировать от 50,000 ₽
                </Button>
              </Link>
              
              <Link to="/cases">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-cosmo-green text-cosmo-green hover:bg-cosmo-green hover:text-white py-6 px-12 text-xl"
                >
                  Смотреть кейсы
                </Button>
              </Link>
              
              <a 
                href="https://t.me/cosmofund" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white py-6 px-12 text-xl"
                >
                  Задать вопрос в Telegram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/c078ebf8-4837-4c3a-a7fb-8ab50ca3e76c.png" 
                alt="Cosmo Life" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-white">COSMO LIFE</span>
            </div>
            <div className="text-white/60 text-sm">
              © 2024 CosmoFund. Все права защищены.
            </div>
          </div>
          
          {/* Legal Links */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6">
              <PublicOffer />
              <span className="text-white/40 hidden md:inline">•</span>
              <span className="text-white/60 text-sm">
                Инвестиции связаны с высоким риском. Не предназначено для резидентов США.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
