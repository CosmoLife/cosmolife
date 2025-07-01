
import { Shield, Zap, Globe, Rocket } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-neon-gradient bg-clip-text text-transparent neon-text">
              Инвестиции в будущее
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              COSMO LIFE — это не просто проект, это целая экосистема инновационных решений, 
              которая объединяет передовые технологии для создания нового мира возможностей.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
              <div className="w-16 h-16 bg-cosmo-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-cosmo-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Метавселенная</h3>
              <p className="text-white/70 text-sm">
                Виртуальные миры с безграничными возможностями для работы, развлечений и социального взаимодействия
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
              <div className="w-16 h-16 bg-cosmo-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-cosmo-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ИИ Технологии</h3>
              <p className="text-white/70 text-sm">
                Искусственный интеллект нового поколения для автоматизации и улучшения качества жизни
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
              <div className="w-16 h-16 bg-cosmo-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-cosmo-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Блокчейн</h3>
              <p className="text-white/70 text-sm">
                Децентрализованные решения для максимальной безопасности и прозрачности всех операций
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
              <div className="w-16 h-16 bg-cosmo-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-cosmo-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Космос</h3>
              <p className="text-white/70 text-sm">
                Инновационные космические проекты и технологии для освоения новых горизонтов
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-8 neon-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-cosmo-blue mb-6 neon-text">
                  Инвестиционная модель
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-cosmo-green rounded-full"></div>
                    <p className="text-white">
                      <strong>Минимальная инвестиция:</strong> ₽50,000 = 0.01% доли
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-cosmo-purple rounded-full"></div>
                    <p className="text-white">
                      <strong>Масштабируемость:</strong> Увеличивайте долю по мере роста проекта
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-cosmo-blue rounded-full"></div>
                    <p className="text-white">
                      <strong>Прозрачность:</strong> Полная отчетность по всем операциям
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4">Прогнозы доходности</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">При оценке ₽357.6 млрд:</span>
                    <span className="text-cosmo-green font-bold">35,760₽/год за 0.01%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">При захвате 5% рынка:</span>
                    <span className="text-cosmo-purple font-bold">1.78M₽ за 0.01%</span>
                  </div>
                </div>
                <p className="text-xs text-white/60 mt-4">
                  * Прогнозы основаны на консервативных оценках рынка
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
