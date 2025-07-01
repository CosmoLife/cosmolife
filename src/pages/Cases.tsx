import Header from '@/components/Header';

const casesData = [
  {
    title: "Разработка ИИ для финтеха",
    description: "Создание проактивного ИИ-ассистента для финансовых операций с машинным обучением",
    result: "Увеличение конверсии на 340%",
    tech: ["React", "Python", "TensorFlow", "API Integration"]
  },
  {
    title: "Создание платформы для метавселенной",
    description: "Разработка иммерсивной платформы с 3D-мирами и NFT-интеграцией",
    result: "В разработке",
    tech: ["UE5", "Blockchain", "WebGL", "Smart Contracts"]
  },
  {
    title: "Создание 5 NFT коллекций",
    description: "Разработка и запуск уникальных NFT коллекций с генеративным искусством и утилити",
    result: "Продажи на $3М+",
    tech: ["NFT", "Generative Art", "Smart Contracts", "Marketplace"]
  },
  {
    title: "Продвижение сетевой продуктовой компании",
    description: "Комплексная маркетинговая стратегия для сети ресторанов быстрого питания",
    result: "Рост продаж на 280%",
    tech: ["Digital Marketing", "Analytics", "CRM", "Mobile App"]
  },
  {
    title: "E-commerce платформа с ИИ",
    description: "Создание маркетплейса с персонализированными рекомендациями",
    result: "Средний чек +180%",
    tech: ["Next.js", "AI/ML", "Payment Systems", "Analytics"]
  },
  {
    title: "Мобильное приложение для доставки",
    description: "Разработка приложения с геолокацией и оптимизацией маршрутов",
    result: "150К+ заказов в месяц",
    tech: ["React Native", "Maps API", "Real-time", "Push Notifications"]
  },
  {
    title: "Блокчейн-платформа для DeFi",
    description: "Создание децентрализованной финансовой платформы с токеномикой",
    result: "$50М+ в TVL",
    tech: ["Solidity", "Web3", "DeFi Protocols", "Smart Contracts"]
  },
  {
    title: "СRM-система для B2B",
    description: "Разработка корпоративной CRM с аналитикой и автоматизацией",
    result: "Эффективность продаж +220%",
    tech: ["Vue.js", "Node.js", "PostgreSQL", "Analytics"]
  },
  {
    title: "Платформа онлайн-образования",
    description: "Создание LMS с адаптивным обучением и геймификацией",
    result: "95% завершаемость курсов",
    tech: ["React", "Video Streaming", "AI Tutoring", "Gamification"]
  },
  {
    title: "Система умного дома",
    description: "IoT-платформа для управления умными устройствами",
    result: "500К+ подключенных устройств",
    tech: ["IoT", "Mobile Apps", "Cloud Infrastructure", "ML"]
  },
  {
    title: "Социальная сеть для креаторов",
    description: "Платформа для монетизации контента с NFT и криптовалютами",
    result: "100К+ пользователей",
    tech: ["Social Features", "Crypto Payments", "Content Management", "NFT"]
  },
  {
    title: "Телемедицинская платформа",
    description: "Создание сервиса для удаленных медицинских консультаций",
    result: "99.8% uptime, 5 стран",
    tech: ["Healthcare Tech", "Video Calls", "HIPAA", "Mobile"]
  },
  {
    title: "Система бронирования для HoReCa",
    description: "Комплексное решение для ресторанов и отелей",
    result: "Загрузка залов +160%",
    tech: ["Booking System", "POS Integration", "Analytics", "Mobile"]
  },
  {
    title: "Криптовалютная биржа",
    description: "Разработка высоконагруженной торговой платформы",
    result: "$1Б+ торгового оборота",
    tech: ["High-Load", "Security", "Trading Engine", "Compliance"]
  },
  {
    title: "AR-приложение для ритейла",
    description: "Создание AR-решения для примерки товаров",
    result: "Возвраты снижены на 60%",
    tech: ["Augmented Reality", "Computer Vision", "Mobile", "3D Modeling"]
  },
  {
    title: "Логистическая платформа",
    description: "Система управления поставками с предиктивной аналитикой",
    result: "Затраты снижены на 35%",
    tech: ["Supply Chain", "Predictive Analytics", "Route Optimization", "IoT"]
  },
  {
    title: "Стриминговая платформа",
    description: "Создание видеоплатформы с адаптивным качеством",
    result: "20М+ просмотров в месяц",
    tech: ["Video Streaming", "CDN", "Adaptive Bitrate", "Analytics"]
  },
  {
    title: "Фитнес-приложение с ИИ",
    description: "Персональный тренер на базе машинного обучения",
    result: "4.9★ в App Store",
    tech: ["Health Tech", "Computer Vision", "Wearables", "ML"]
  },
  {
    title: "Банковское мобильное приложение",
    description: "Разработка безопасного банкинга с биометрией",
    result: "Top-3 в категории финансы",
    tech: ["Banking", "Biometrics", "Security", "PCI DSS"]
  },
  {
    title: "Платформа для фрилансеров",
    description: "Создание маркетплейса услуг с эскроу-платежами",
    result: "Комиссия снижена до 3%",
    tech: ["Marketplace", "Escrow", "Ratings", "Payment Processing"]
  },
  {
    title: "VR-тренинговая система",
    description: "Иммерсивная платформа для корпоративного обучения",
    result: "Усвоение материала +300%",
    tech: ["Virtual Reality", "Learning Management", "3D Graphics", "Analytics"]
  }
];

const Cases = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-neon-gradient bg-clip-text text-transparent neon-text">
              Кейсы Cosmo Lab
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Более 100 успешных проектов для клиентов и 30+ собственных запусков. 
              Опыт создания решений мирового уровня в различных отраслях.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casesData.map((caseItem, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border hover:neon-border transition-all duration-300 group hover:scale-105"
              >
                <h3 className="text-xl font-bold text-cosmo-blue mb-4 neon-text group-hover:text-cosmo-purple transition-colors">
                  {caseItem.title}
                </h3>
                
                <p className="text-white/80 mb-4 leading-relaxed">
                  {caseItem.description}
                </p>
                
                <div className="mb-4">
                  <div className="text-cosmo-green font-bold neon-text">
                    {caseItem.result}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {caseItem.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="bg-cosmo-blue/20 text-cosmo-blue px-3 py-1 rounded-full text-xs border border-cosmo-blue/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-8 neon-border max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-cosmo-purple mb-4 neon-text">
                Готовы к новому проекту?
              </h2>
              <p className="text-white/80 mb-6">
                Cosmo Lab занимается созданием сайтов, проактивных агентов, продвижением. 
                Имеет опыт более 100 проектов для клиентов и более 30 собственных запусков.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <a 
                  href="https://t.me/cosmofund" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 rounded-lg neon-border animate-neon-pulse transition-all"
                >
                  Обсудить проект в Telegram
                </a>
                <a 
                  href="https://wa.me/77777777777" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-cosmo-purple to-cosmo-green hover:from-cosmo-green hover:to-cosmo-blue text-white font-bold py-4 px-8 rounded-lg neon-border animate-neon-pulse transition-all"
                >
                  Обсудить проект в WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cases;
