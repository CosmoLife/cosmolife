
const Cases = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-neon-gradient bg-clip-text text-transparent neon-text">
            Кейсы и достижения
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border text-center">
              <div className="text-4xl font-bold text-cosmo-blue neon-text mb-4">100+</div>
              <h3 className="text-xl font-bold text-white mb-2">Проектов для клиентов</h3>
              <p className="text-white/70">Успешно реализованных проектов различной сложности</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border text-center">
              <div className="text-4xl font-bold text-cosmo-purple neon-text mb-4">30+</div>
              <h3 className="text-xl font-bold text-white mb-2">Собственных запусков</h3>
              <p className="text-white/70">Наши проекты, принесшие прибыль инвесторам</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border text-center">
              <div className="text-4xl font-bold text-cosmo-green neon-text mb-4">150+</div>
              <h3 className="text-xl font-bold text-white mb-2">Специалистов</h3>
              <p className="text-white/70">Команда профессионалов по всему миру</p>
            </div>
          </div>
          
          {/* Блок реальных кейсов */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-cosmo-blue neon-text">
              Некоторые кейсы
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Кейс 1 - Метавселенная в разработке */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-8 neon-border">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-cosmo-purple rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">🌍</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-cosmo-purple neon-text">Метавселенная</h4>
                    <p className="text-white/60 text-sm">В активной разработке</p>
                  </div>
                </div>
                <p className="text-white/80 mb-6">
                  Создаем инновационную метавселенную с виртуальной экономикой, 
                  NFT-интеграцией, проактивными агентами и блокчейн-технологиями. Проект находится в активной стадии разработки.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cosmo-green neon-text">В работе</div>
                    <div className="text-white/60 text-sm">Статус проекта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cosmo-blue neon-text">2024</div>
                    <div className="text-white/60 text-sm">Планируемый запуск</div>
                  </div>
                </div>
              </div>
              
              {/* Кейс 2 - ИИ-платформа */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-8 neon-border">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-cosmo-blue rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">🤖</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-cosmo-blue neon-text">AI Trading Platform</h4>
                    <p className="text-white/60 text-sm">Автоматизированная торговля</p>
                  </div>
                </div>
                <p className="text-white/80 mb-6">
                  ИИ-платформа для автоматической торговли криптовалютами с машинным обучением 
                  и анализом рынка в реальном времени. Высокая доходность для инвесторов.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cosmo-green neon-text">300%+</div>
                    <div className="text-white/60 text-sm">ROI за год</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cosmo-purple neon-text">$2M+</div>
                    <div className="text-white/60 text-sm">Объем торгов</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Кейс 3 - DeFi протокол */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-8 neon-border">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-cosmo-green rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">⚡</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-cosmo-green neon-text">DeFi Protocol</h4>
                    <p className="text-white/60 text-sm">Децентрализованные финансы</p>
                  </div>
                </div>
                <p className="text-white/80 mb-6">
                  Собственный DeFi протокол с уникальными алгоритмами 
                  автоматического маркет-мейкинга и высокой ликвидностью.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cosmo-blue neon-text">$12M+</div>
                    <div className="text-white/60 text-sm">TVL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cosmo-purple neon-text">20K+</div>
                    <div className="text-white/60 text-sm">Транзакций</div>
                  </div>
                </div>
              </div>
              
              {/* Кейс 4 - NFT коллекции */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-8 neon-border">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-cosmo-purple rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">🎨</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-cosmo-purple neon-text">NFT Collections</h4>
                    <p className="text-white/60 text-sm">Эксклюзивные коллекции</p>
                  </div>
                </div>
                <p className="text-white/80 mb-6">
                  Создали и успешно запустили 5 уникальных NFT коллекций 
                  с инновационными концепциями и высоким спросом на рынке.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cosmo-green neon-text">$3M+</div>
                    <div className="text-white/60 text-sm">Общие продажи</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cosmo-blue neon-text">5</div>
                    <div className="text-white/60 text-sm">Коллекций</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Дополнительные успешные кейсы */}
            <div className="bg-gradient-to-r from-cosmo-blue/10 to-cosmo-purple/10 rounded-2xl p-8 neon-border">
              <h4 className="text-2xl font-bold text-center mb-8 text-cosmo-blue neon-text">
                Другие успешные направления
              </h4>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-cosmo-green neon-text mb-2">GameFi Projects</div>
                  <div className="text-white/70">$2.5M+ прибыль</div>
                  <div className="text-white/50 text-sm">60K+ игроков</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-cosmo-purple neon-text mb-2">Crypto Solutions</div>
                  <div className="text-white/70">150K+ пользователей</div>
                  <div className="text-white/50 text-sm">$40M+ активов</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-cosmo-blue neon-text mb-2">DAO Platforms</div>
                  <div className="text-white/70">300+ DAO</div>
                  <div className="text-white/50 text-sm">$20M+ управление</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-cosmo-green neon-text mb-2">Staking Protocols</div>
                  <div className="text-white/70">12%+ APY</div>
                  <div className="text-white/50 text-sm">$30M+ заблокировано</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Блок "Есть вопросы?" */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-12 neon-border text-center">
            <h3 className="text-3xl font-bold text-cosmo-blue mb-6 neon-text">
              Есть вопросы?
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <a 
                href="https://t.me/CosmoLifeApp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 rounded-xl text-lg neon-border animate-neon-pulse transition-all">
                  Задать вопрос в Telegram
                </button>
              </a>
              
              <a 
                href="https://wa.me/79635124265" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="bg-gradient-to-r from-cosmo-green to-cosmo-blue hover:from-cosmo-blue hover:to-cosmo-purple text-white font-bold py-4 px-8 rounded-xl text-lg neon-border animate-neon-pulse transition-all">
                  Задать вопрос в WhatsApp
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

export default Cases;
