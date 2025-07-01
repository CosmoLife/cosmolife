
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-neon-gradient bg-clip-text text-transparent neon-text">
            COSMO LIFE
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
            Революционная экосистема будущего: от виртуальной реальности до космических технологий.
            Присоединяйтесь к созданию новой цифровой цивилизации.
          </p>
          
          <div className="space-y-4 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-cosmo-blue neon-text">₽5M</div>
                  <div className="text-white/80">Стоимость доли 1%</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cosmo-purple neon-text">0.01%</div>
                  <div className="text-white/80">За ₽50,000</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cosmo-green neon-text">∞</div>
                  <div className="text-white/80">Потенциал роста</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 text-lg neon-border animate-neon-pulse"
            >
              Начать инвестировать
            </Button>
            
            <Button
              variant="outline"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-cosmo-blue/50 text-cosmo-blue hover:bg-cosmo-blue/20 font-bold py-4 px-8 text-lg backdrop-blur-lg"
            >
              Узнать больше
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-white/60">
            <p>Минимальная инвестиция: ₽50,000 • Доля: 0.01%</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
