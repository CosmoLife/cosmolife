const Roadmap = () => {
  const roadmapItems = [
    {
      period: "1-4 кв. 2025",
      title: "Разработка приложения VINNI",
      description: "Разработка приложения VINNI в Telegram и мобильного приложения для Android и iOS за собственные средства. Посевные инвестиции от ангелов в размере 10,000,000 рублей. Все выполнено, разработка на 99%",
      status: "completed"
    },
    {
      period: "осень 2025",
      title: "Запуск сбора инвестиций",
      description: "Запуск сбора инвестиций для маркетинга проекта с личным кабинетом, привлечение 100,000,000 рублей, продаем 10% долей в проекте",
      status: "current"
    },
    {
      period: "Осень 2025", 
      title: "MVP и реферальная система",
      description: "Запуск тестовой MVP версии приложения для 5,000 ранних последователей. Клубная реферальная система с подпиской. Запуск игры VINNI GAME с матричной реферальной системой. Запуск VINNI Factory - фабрика по производству ИИ контента и размещение на наших аккаунтах в соцсетях. Мощный трафик с тысяч аккаунтов в социальных сетях. Цель: 10,000+ участников",
      status: "upcoming"
    },
    {
      period: "1-2 кв. 2026",
      title: "Альфа версия глобально",
      description: "Выпуск Альфа версии с всеми сервисами (ИИ, такси, еда, маркетплейс, работа, необанк) в России, СНГ, США, Европе. Цель: 30-50,000 пользователей",
      status: "upcoming"
    },
    {
      period: "3-4 кв. 2026",
      title: "Бета версия в Азии и Латинской Америке",
      description: "Масштабирование на Азию и Латинскую Америку. Цель: 100-150,000 пользователей, 500,000+ участников реферальной программы",
      status: "upcoming"
    },
    {
      period: "2027",
      title: "Привлечение крупных инвесторов",
      description: "Финансовый аудит, продажа 10% доли за 10 млрд рублей, подготовка к IPO. Версия V2.0. Цель: 500,000+ пользователей, 1,000,000+ участников реферальной программы",
      status: "future"
    },
    {
      period: "2028",
      title: "Рост и подготовка к IPO",
      description: "Достижение 1% мирового рынка (выручка 10 млрд ₽, капитализация 100 млрд ₽). Версия V3.0. Цель: 2,000,000+ пользователей, 2,500,000+ участников",
      status: "future"
    },
    {
      period: "2029-30",
      title: "Выход на IPO",
      description: "Выход на NASDAQ с капитализацией 500-900 млрд рублей, продажа 10% акций за 90 млрд рублей. Приложение охватывает 5% рынка",
      status: "ipo"
    }
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "border-cosmo-green shadow-holographic text-cosmo-green";
      case "current":
        return "border-quantum-flux shadow-quantum text-cosmo-purple";
      case "upcoming":
        return "border-cyber-electric shadow-holographic text-cosmo-blue";
      case "future":
        return "border-cyber-magenta text-cosmo-green";
      case "ipo":
        return "border-cosmo-gold text-cosmo-gold shadow-holographic";
      default:
        return "border-white/20 text-white/80";
    }
  };

  return (
    <section id="roadmap" className="py-20 relative cyber-grid">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-quantum-flux/10 rounded-full blur-3xl animate-holographic-spin"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyber-purple/15 rounded-full blur-3xl animate-energy-flow"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 holo-text animate-holo-shift">
            Дорожная карта
          </h2>
          <p className="text-xl text-center mb-16 text-white/80">
            Путь к IPO и революции в мире суперприложений
          </p>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-quantum-flux via-cyber-electric to-cosmo-gold opacity-60"></div>
            
            <div className="space-y-8">
              {roadmapItems.map((item, index) => (
                <div 
                  key={index}
                  className={`relative flex items-start space-x-6 glass-premium neuro-card p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] magnetic-element ${getStatusStyles(item.status)}`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-2 top-8 w-4 h-4 rounded-full border-4 ${getStatusStyles(item.status)} bg-space-dark`}></div>
                  
                  <div className="flex-1 ml-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="text-2xl font-bold cyber-text mb-2 md:mb-0">
                        {item.title}
                      </h3>
                      <span className={`text-lg font-bold px-4 py-2 rounded-full border ${getStatusStyles(item.status)} neon-text`}>
                        {item.period}
                      </span>
                    </div>
                    
                    <p className="text-white/80 leading-relaxed text-lg">
                      {item.description}
                    </p>
                    
                    {item.status === "completed" && (
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-cosmo-green rounded-full"></div>
                        <span className="text-cosmo-green font-semibold neon-text">✅ Выполнено</span>
                      </div>
                    )}
                    
                    {item.status === "current" && (
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-quantum-flux rounded-full animate-pulse"></div>
                        <span className="text-quantum-flux font-semibold neon-text">Текущий этап</span>
                      </div>
                    )}
                    
                    {item.status === "ipo" && (
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-cosmo-gold rounded-full animate-pulse"></div>
                        <span className="text-cosmo-gold font-semibold neon-text">🎯 Главная цель</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary Card */}
          <div className="mt-16 glass-premium rounded-3xl p-8 border border-cosmo-gold/30 neon-border">
            <h3 className="text-3xl font-bold text-center mb-6 text-cosmo-gold neon-text">
              Цель: IPO на NASDAQ
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-cosmo-gold neon-text mb-2">500-900 млрд ₽</div>
                <div className="text-white/60">Капитализация при IPO</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyber-electric neon-text mb-2">5%</div>
                <div className="text-white/60">Доля мирового рынка</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cosmo-purple neon-text mb-2">2029-30</div>
                <div className="text-white/60">Выход на биржу</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;