
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cosmo-blue/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmo-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cosmo-green/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-neon-gradient bg-clip-text text-transparent neon-text animate-glow">
            COSMO LIFE
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Инвестируй, как умные деньги, но с минимальным порогом входа всего от{' '}
            <span className="text-cosmo-green font-bold neon-text">50,000 рублей!</span>
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 neon-border">
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
                className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 text-lg neon-border animate-neon-pulse"
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
                className="border-cosmo-green text-cosmo-green hover:bg-cosmo-green hover:text-white py-4 px-8 text-lg"
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
