
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
          
          {/* Блок "Есть вопросы?" */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-12 neon-border text-center">
            <h3 className="text-3xl font-bold text-cosmo-blue mb-6 neon-text">
              Есть вопросы?
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <a 
                href="https://t.me/CosmoLifeАpp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 rounded-xl text-lg neon-border animate-neon-pulse transition-all">
                  Задать вопрос в Telegram
                </button>
              </a>
              
              <a 
                href="https://wa.me/79123456789" 
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
