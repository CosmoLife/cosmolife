import cosmoAutumn from "@/assets/cosmo-autumn-2025.jpg";
import cosmoMorning from "@/assets/cosmo-morning.jpg";
import cosmoBreakfast from "@/assets/cosmo-breakfast.jpg";
import cosmoWork from "@/assets/cosmo-work.jpg";
import cosmoDay from "@/assets/cosmo-day.jpg";
import cosmoEvening from "@/assets/cosmo-evening.jpg";
import cosmoNight from "@/assets/cosmo-night.jpg";

const DayWithCosmo = () => {
  return (
    <section id="day-with-cosmo" className="py-20 relative bg-gradient-to-b from-space-dark to-slate-900">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-cosmo-blue">
            Представь свой день с Cosmo Life
          </h2>
          
          <div className="glass-premium p-8 rounded-3xl space-y-8">
            <div className="text-lg text-white/90 leading-relaxed">
              <div className="mb-6 rounded-xl overflow-hidden">
                <img 
                  src={cosmoAutumn} 
                  alt="Осень 2025 года - уютная квартира с панорамным окном" 
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
              <p className="mb-6">
                <strong>Представь, осень 2025 года 🍂</strong><br/>
                Золотая листва кружит за окном, ты просыпаешься в своей уютной квартире, а твой смартфон оживает мягким, дружеским голосом Cosmo Life — твоего ИИ-ассистента, который знает тебя как лучший друг. 😊 Это не просто приложение, а суперсервис будущего, объединяющий всё: от заказа еды до работы и отдыха. Cosmo Life живёт в твоём телефоне, в мессенджерах, а если нацепишь AR-очки — он там, с дополненной реальностью, и уже готовится к VR в зарождающейся метавселенной. 🌌 Это проактивный голосовой нейроинтерфейс: он изучает твои привычки, но действует только с твоего разрешения, автоматизируя то, что ты одобрил. Всё интуитивно, как болтовня с другом. Пойдём по твоему дню, чтобы ты почувствовал, как Cosmo Life делает жизнь ярче и проще! 🎉
              </p>
            </div>

            <div className="text-lg text-white/90 leading-relaxed">
              <p className="mb-6 font-medium text-cosmo-green">
                Cosmo Life закрывает все твои потребности: еда, транспорт, покупки, работа, общение, досуг. Он не просто автоматизирует, а делает жизнь ярче, как будто у тебя есть друг, который всегда на шаг впереди, но ждёт твоего слова. 😊
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DayWithCosmo;