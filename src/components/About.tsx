
const About = () => {
  return (
    <section id="about" className="py-20 relative cyber-grid">
      {/* Optimized Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-quantum-flux/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 holo-text">
            О проекте
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold cyber-text">IT-гигант мирового уровня</h3>
              <p className="text-white/80 leading-relaxed">
                IT-гигант и фонд с офисами в Америке, Азии, Европе, СНГ 
                и командами разработчиков по всему миру (более 150 специалистов). 
                У нас уникальный опыт: продвигали сотни крупнейших брендов и блокчейн проектов, 
                создаем метавселенную, ИИ-агентов и теперь запускаем твой билет в будущее.
              </p>
            </div>
            
            <div className="glass-premium neuro-card p-6">
              <h4 className="text-xl font-bold text-cosmo-purple mb-4 neon-text">Наш опыт:</h4>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cosmo-green rounded-full mr-3"></span>
                  Более 100 проектов для клиентов
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cosmo-blue rounded-full mr-3"></span>
                  Более 30 собственных запусков
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cosmo-purple rounded-full mr-3"></span>
                  Многомиллионная прибыль для инвесторов
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cosmo-green rounded-full mr-3"></span>
                  Актуальный маркетинг и тренды
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-8 neon-border">
            <h3 className="text-3xl font-bold text-center mb-8 text-cosmo-blue neon-text">
              Прогнозируемая доходность VINNI
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-cosmo-green neon-text mb-2">1.2 млрд ₽</div>
                <div className="text-white/60">Суммарный доход с 0.01% рынка</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cosmo-purple neon-text mb-2">357.6 млн ₽</div>
                <div className="text-white/60">Общая прибыль после расходов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cosmo-blue neon-text mb-2">601.75 млрд ₽</div>
                <div className="text-white/60">Потенциал при 5% рынка</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { service: 'Такси', market: '200 млрд $', commission: '10%', profit: '55 млн ₽' },
                { service: 'Доставка еды', market: '300 млрд $', commission: '15%', profit: '112 млн ₽' },
                { service: 'Маркетплейс', market: '500 млрд $', commission: '12%', profit: '149 млн ₽' },
                { service: 'Поиск работы', market: '100 млрд $', commission: '10%', profit: '25 млн ₽' },
                { service: 'Необанк', market: '1 трлн $', commission: '1%', profit: '16.6 млн ₽' }
              ].map((item, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                  <h4 className="font-bold text-cosmo-blue mb-2">{item.service}</h4>
                  <div className="text-sm space-y-1 text-white/70">
                    <div>Рынок: {item.market}</div>
                    <div>Комиссия: {item.commission}</div>
                    <div className="text-cosmo-green font-bold">Прибыль: {item.profit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
