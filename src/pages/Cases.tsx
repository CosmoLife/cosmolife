
import { Button } from '@/components/ui/button';
import { ExternalLink, Zap, Globe, Shield, Rocket, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cases = () => {
  const navigate = useNavigate();

  const projects = [
    {
      title: "Cosmo VR World",
      description: "Революционная платформа виртуальной реальности с собственной экономикой и социальными механиками. Пользователи могут создавать, владеть и монетизировать виртуальные активы.",
      icon: Globe,
      status: "В разработке",
      progress: 65,
      color: "cosmo-blue"
    },
    {
      title: "Cosmo AI Assistant",
      description: "Персональный ИИ-помощник нового поколения с возможностями машинного обучения и интеграцией в IoT экосистему для умного дома и офиса.",
      icon: Zap,
      status: "Бета-тестирование",
      progress: 80,
      color: "cosmo-purple"
    },
    {
      title: "Cosmo Chain",
      description: "Собственная блокчейн-платформа с уникальными возможностями для DeFi, NFT и децентрализованных приложений с низкими комиссиями.",
      icon: Shield,
      status: "MVP готов",
      progress: 45,
      color: "cosmo-green"
    },
    {
      title: "Cosmo Space Tech",
      description: "Инновационные космические технологии: от спутниковых систем связи до исследовательских проектов по освоению космоса.",
      icon: Rocket,
      status: "Исследования",
      progress: 25,
      color: "cosmo-blue"
    }
  ];

  const stats = [
    { label: "Проектов в разработке", value: "12+", icon: TrendingUp },
    { label: "Специалистов в команде", value: "150+", icon: Users },
    { label: "Инвестиций привлечено", value: "₽2.1B", icon: Zap },
  ];

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-neon-gradient bg-clip-text text-transparent neon-text">
              Наши проекты
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Каждый проект COSMO LIFE — это инновационное решение, которое формирует будущее технологий и создает новые возможности для инвесторов.
            </p>
          </div>

          {/* Статистика */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
                <stat.icon className="w-12 h-12 text-cosmo-blue mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2 neon-text">
                  {stat.value}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Проекты */}
          <div className="space-y-8 mb-16">
            {projects.map((project, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 bg-${project.color}/20 rounded-full flex items-center justify-center`}>
                        <project.icon className={`w-8 h-8 text-${project.color}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold bg-${project.color}/20 text-${project.color}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/80">Прогресс разработки</span>
                        <span className="text-white font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                          className={`bg-${project.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-white/60">
                      <p className="mb-2">
                        <strong>Потенциальный рынок:</strong> ₽{Math.floor(Math.random() * 500 + 100)} млрд
                      </p>
                      <p>
                        <strong>Ожидаемый запуск:</strong> {2024 + Math.floor(index / 2)} год
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Призыв к действию */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-8 neon-border text-center">
            <h2 className="text-3xl font-bold text-cosmo-blue mb-4 neon-text">
              Станьте частью революции
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Инвестируйте в COSMO LIFE уже сегодня и получите долю в каждом из наших инновационных проектов. 
              Ваши инвестиции помогают создавать технологии будущего.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-6">
              <Button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 text-lg neon-border animate-neon-pulse"
              >
                Начать инвестировать
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-2 border-cosmo-blue/50 text-cosmo-blue hover:bg-cosmo-blue/20 font-bold py-4 px-8 text-lg backdrop-blur-lg"
              >
                Узнать больше
              </Button>
            </div>
            
            <div className="text-sm text-white/60">
              <p>Минимальная инвестиция: ₽50,000 • Доля: 0.01% • Потенциал: неограничен</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cases;
