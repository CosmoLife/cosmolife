
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import InvestmentButton from '@/components/InvestmentButton';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 cyber-grid">
      {/* Optimized Background Effects */}
      <div className="absolute inset-0">
        {/* Static particles for better performance */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-quantum-flux/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-magenta/15 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-holo-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-cyber-electric/8 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 holo-text">
            VINNI
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Инвестируй, как умные деньги, но с минимальным порогом входа всего от{' '}
            <span className="cyber-text">50,000 рублей!</span>
          </p>
          
          <div className="glass-premium neuro-card quantum-particle magnetic-element p-8 mb-8">
            <p className="text-lg text-white/80 mb-6">
              VINNI — это суперприложение в Telegram, App Store и Google Play, уже на{' '}
              <span className="text-cosmo-blue font-bold">99% готово к запуску</span> на весь мир, 
              включая РФ, Америку, Азию, Европу и СНГ.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-cosmo-blue font-bold mb-3 neon-text">Проактивный ИИ-ассистент:</h3>
                <ul className="text-white/80 space-y-2 text-sm">
                  <li>• Заказывает такси дешевле</li>
                  <li>• Подбирает любимую еду по лучшей цене</li>
                  <li>• Находит работу и специалистов</li>
                  <li>• Экономит деньги при покупках</li>
                </ul>
              </div>
              <div>
                <h3 className="text-cosmo-purple font-bold mb-3 neon-text">Современный необанк:</h3>
                <ul className="text-white/80 space-y-2 text-sm">
                  <li>• Мгновенные переводы по миру</li>
                  <li>• Любая валюта</li>
                  <li>• Финансовое планирование</li>
                  <li>• Разумное распределение финансов</li>
                </ul>
              </div>
            </div>
          </div>
          
          <InvestmentButton />
        </div>
      </div>
    </section>
  );
};

export default Hero;
