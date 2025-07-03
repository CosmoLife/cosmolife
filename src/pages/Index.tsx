
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
      
      {/* Дорожная карта */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-neon-gradient bg-clip-text text-transparent neon-text">
              Дорожная карта
            </h2>
            
            <div className="relative">
              {/* Временная линия */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-cosmo-blue via-cosmo-purple to-cosmo-green h-full"></div>
              
              <div className="space-y-12">
                {/* 2024 Q4 */}
                <div className="flex items-center relative">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-6 neon-border">
                      <h3 className="text-xl font-bold text-cosmo-blue neon-text mb-2">Q4 2024</h3>
                      <h4 className="text-lg font-semibold text-white mb-3">Запуск инвестиционной платформы</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Привлечение первых инвесторов</li>
                        <li>• Развитие команды разработчиков</li>
                        <li>• Начало работы над ключевыми продуктами</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cosmo-blue rounded-full border-4 border-space-dark"></div>
                  <div className="w-1/2 pl-8"></div>
                </div>
                
                {/* 2025 */}
                <div className="flex items-center relative">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cosmo-purple rounded-full border-4 border-space-dark"></div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-6 neon-border">
                      <h3 className="text-xl font-bold text-cosmo-purple neon-text mb-2">2025</h3>
                      <h4 className="text-lg font-semibold text-white mb-3">Развитие AI и DeFi продуктов</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Запуск AI Trading Platform</li>
                        <li>• Развитие DeFi протоколов</li>
                        <li>• Расширение NFT направления</li>
                        <li>• Первые выплаты инвесторам</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* 2026 */}
                <div className="flex items-center relative">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-6 neon-border">
                      <h3 className="text-xl font-bold text-cosmo-green neon-text mb-2">2026</h3>
                      <h4 className="text-lg font-semibold text-white mb-3">Глобальная экспансия</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Выход на международные рынки</li>
                        <li>• Партнерство с крупными корпорациями</li>
                        <li>• Запуск GameFi экосистемы</li>
                        <li>• Развитие проактивных ИИ-агентов</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cosmo-green rounded-full border-4 border-space-dark"></div>
                  <div className="w-1/2 pl-8"></div>
                </div>
                
                {/* 2026-2027 */}
                <div className="flex items-center relative">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cosmo-blue rounded-full border-4 border-space-dark"></div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-6 neon-border">
                      <h3 className="text-xl font-bold text-cosmo-blue neon-text mb-2">2026-2027</h3>
                      <h4 className="text-lg font-semibold text-white mb-3">Запуск метавселенной</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Полноценная метавселенная с экономикой</li>
                        <li>• Интеграция всех продуктов экосистемы</li>
                        <li>• Проактивные ИИ-агенты в метавселенной</li>
                        <li>• Виртуальные офисы и мероприятия</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* 2027+ */}
                <div className="flex items-center relative">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-6 neon-border">
                      <h3 className="text-xl font-bold text-cosmo-purple neon-text mb-2">2027+</h3>
                      <h4 className="text-lg font-semibold text-white mb-3">Лидерство в Web3</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Доминирующая позиция в метавселенных</li>
                        <li>• Собственная блокчейн-экосистема</li>
                        <li>• Массовое внедрение решений</li>
                        <li>• IPO или стратегический выход</li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cosmo-purple rounded-full border-4 border-space-dark"></div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              </div>
            </div>
            
            {/* Целевые показатели */}
            <div className="mt-16 bg-gradient-to-r from-cosmo-blue/10 to-cosmo-purple/10 rounded-2xl p-8 neon-border">
              <h3 className="text-2xl font-bold text-center mb-8 text-cosmo-blue neon-text">
                Целевые показатели к 2027 году
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cosmo-green neon-text mb-2">$1B+</div>
                  <div className="text-white/70">Общая капитализация</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cosmo-purple neon-text mb-2">10M+</div>
                  <div className="text-white/70">Пользователей экосистемы</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cosmo-blue neon-text mb-2">500%+</div>
                  <div className="text-white/70">ROI для инвесторов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cosmo-green neon-text mb-2">50+</div>
                  <div className="text-white/70">Стран присутствия</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
