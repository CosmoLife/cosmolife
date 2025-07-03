
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 cyber-grid">
      {/* 2025 Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Quantum Particles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-quantum-flux/30 rounded-full blur-3xl animate-energy-flow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-magenta/20 rounded-full blur-3xl animate-holographic-spin" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-holo-accent/25 rounded-full blur-2xl animate-neural-glow" style={{ animationDelay: '4s' }}></div>
        
        {/* Holographic Orbs */}
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-holo-primary/15 rounded-full blur-2xl animate-quantum-rotate"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-cyber-electric/10 rounded-full blur-3xl animate-energy-flow" style={{ animationDelay: '6s' }}></div>
        
        {/* Neural Network Lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--cyber-electric))', stopOpacity: 0.3 }} />
                <stop offset="50%" style={{ stopColor: 'hsl(var(--quantum-flux))', stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: 'hsl(var(--holo-primary))', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            <path d="M0,50 Q250,25 500,50 T1000,50" stroke="url(#neuralGradient)" strokeWidth="2" fill="none" className="animate-energy-flow"/>
            <path d="M0,150 Q300,125 600,150 T1200,150" stroke="url(#neuralGradient)" strokeWidth="1" fill="none" className="animate-energy-flow" style={{ animationDelay: '2s' }}/>
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 holo-text animate-holo-shift">
            COSMO LIFE
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Инвестируй, как умные деньги, но с минимальным порогом входа всего от{' '}
            <span className="cyber-text animate-cyber-pulse">50,000 рублей!</span>
          </p>
          
          <div className="glass-premium neuro-card quantum-particle magnetic-element p-8 mb-8">
            <p className="text-lg text-white/80 mb-6">
              Cosmo Life — это суперприложение в Telegram, App Store и Google Play, уже на{' '}
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
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="neuro-button magnetic-element premium-hover quantum-border bg-holo-gradient text-white font-bold py-4 px-8 text-lg animate-neural-glow"
              >
                Инвестировать сейчас
              </Button>
            </Link>
            
            <a 
              href="#about" 
              className="inline-block"
            >
              <Button 
                variant="outline" 
                size="lg"
                className="neuro-button magnetic-element quantum-border border-cyber-electric text-cyber-electric hover:bg-cyber-electric hover:text-neuro-dark py-4 px-8 text-lg"
              >
                Узнать больше
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
