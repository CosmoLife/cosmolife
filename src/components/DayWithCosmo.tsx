import cosmoAutumn from "@/assets/cosmo-autumn-2025.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DayWithCosmo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePersonalCabinetClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  return (
    <section id="day-with-cosmo" className="py-20 relative bg-gradient-to-b from-space-dark to-slate-900">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-cosmo-blue">
            Представь свой день с VINNI
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
                Золотая листва кружит за окном, ты просыпаешься в своей уютной квартире, а твой смартфон оживает мягким, дружеским голосом VINNI — твоего ИИ-ассистента, который знает тебя как лучший друг. 😊 Это не просто приложение, а суперсервис будущего, объединяющий всё: от заказа еды до работы и отдыха. VINNI живёт в твоём телефоне, в мессенджерах, а если нацепишь AR-очки — он там, с дополненной реальностью, и уже готовится к VR в зарождающейся метавселенной. 🌌 Это проактивный голосовой нейроинтерфейс: он изучает твои привычки, но действует только с твоего разрешения, автоматизируя то, что ты одобрил. Всё интуитивно, как болтовня с другом. Пойдём по твоему дню, чтобы ты почувствовал, как VINNI делает жизнь ярче и проще! 🎉
              </p>
            </div>

            <div className="grid gap-8">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-cosmo-green mb-4">Утро ☀️</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Ты встаёшь в 7:30, и VINNI, зная твою любовь к утреннему кофе, говорит нежным голосом:<br/>
                  <em className="text-cosmo-blue">"Доброе утро! Заказать твой капучино с корицей из кофейни рядом? Будет через 6 минут! ☕"</em><br/>
                  Он уже нашёл лучшую цену и учёл, что ты предпочитаешь кофе без сахара. Ты говоришь: "Давай!" — и заказ в пути. 🚀
                </p>
                <p className="text-white/80 leading-relaxed">
                  Пока собираешься, VINNI продолжает:<br/>
                  <em className="text-cosmo-blue">"Такси до работы? Машина в 2 минутах, маршрут без пробок. 🚗"</em><br/>
                  Ты подтверждаешь: "Окей", и такси ждёт у подъезда. VINNI знает твой график и предлагает только то, что тебе удобно.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-cosmo-purple mb-4">Завтрак 🍳</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Думаешь про еду? VINNI предлагает:<br/>
                  <em className="text-cosmo-blue">"Заказать продукты для омлета? В супермаркете акция, доставка за полчаса! 🛒"</em><br/>
                  Он подбирает самые свежие и дешёвые продукты, как в лучших сервисах доставки. Если хочешь шопинг, встроенный маркетплейс VINNI ищет товары — от кроссовок до гаджетов — по самым низким ценам, сравнивая миллионы предложений за секунды. 💸
                </p>
                <p className="text-white/80 leading-relaxed">
                  Ты говоришь: "Найди чёрные кроссы, размер 42".<br/>
                  VINNI отвечает: <em className="text-cosmo-blue">"Вот 3 варианта, скидки до 35%!"</em>
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-cosmo-blue mb-4">Работа 💼</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  В офисе нужно написать коллегам. VINNI говорит:<br/>
                  <em className="text-cosmo-blue">"Открыть чат с командой? Диктуй! 📱"</em><br/>
                  Ты говоришь: "Ребята, готовим презентацию к завтра", и он отправляет сообщение с идеальными смайлами. 😊 Если задача сложнее, он предлагает:<br/>
                  <em className="text-cosmo-blue">"Составить черновик презентации? Подтяну данные из твоих заметок и базы рынка. 📊"</em>
                </p>
                <p className="text-white/80 leading-relaxed">
                  Хочешь подработку? VINNI говорит:<br/>
                  <em className="text-cosmo-blue">"Нашёл 3 фриланс-проекта: дизайн, копирайтинг, консультации. Показать детали? 💻"</em><br/>
                  Он подключён к огромной базе данных, так что может найти вакансии или составить бизнес-план за пару секунд. Просто скажи: "Сделай план для стартапа", и он выдаст документ с графиками, анализом рынка и даже советами для инвесторов. 📈
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-cosmo-green mb-4">День 🛠️</h3>
                <p className="text-white/80 leading-relaxed">
                  Дома потёк кран. Ты говоришь: "VINNI, найди сантехника!"<br/>
                  Он отвечает: <em className="text-cosmo-blue">"Мастер готовый сейчас поработать с рейтингом 4.9, в соседнем доме, будет через 15 минут. Заказать? 🔧"</em><br/>
                  Это как сервис по поиску исполнителей, но быстрее: он проверяет рейтинги, цены и расстояние. Нужна уборка или повесить картину? Лучший мастер найдётся за секунды. 🧹
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-cosmo-purple mb-4">Вечер 🎶</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Пора расслабиться. VINNI говорит:<br/>
                  <em className="text-cosmo-blue">"Ресторан с живой музыкой в твоём стиле, столик на 7? Или кино с друзьями? 🎬"</em><br/>
                  Он использует встроенные карты, знает твои предпочтения и даже погоду:<br/>
                  <em className="text-cosmo-blue">"Возьми зонт, вечером дождь! ☔"</em><br/>
                  В AR-очках он показывает маршрут до ресторана прямо на улице, как в игре.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Хочешь подарок другу? VINNI предлагает:<br/>
                  <em className="text-cosmo-blue">"На маркетплейсе есть книга, которую он хотел, скидка 30%, доставка завтра. Добавить открытку? 🎁"</em><br/>
                  Ты подтверждаешь, и всё организовано.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-cosmo-blue mb-4">Конец дня 🌙</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Дома ты хочешь расслабиться. VINNI говорит:<br/>
                  <em className="text-cosmo-blue">"Комедия после насыщенного дня? Вот 3 варианта под твоё настроение. 🎥"</em><br/>
                  Или, если проголодался:<br/>
                  <em className="text-cosmo-blue">"Заказать пиццу из твоей любимой доставки? Есть акция! 🍕"</em>
                </p>
                <p className="text-white/80 leading-relaxed font-medium text-cosmo-green">
                  VINNI закрывает все твои потребности: еда, транспорт, покупки, работа, общение, досуг. Он не просто автоматизирует, а делает жизнь ярче, как будто у тебя есть друг, который всегда на шаг впереди, но ждёт твоего слова. 😊
                </p>
                <p className="text-white/80 leading-relaxed mt-4 text-center">
                  🎬 Эксклюзивные видео ждут вас в{' '}
                  <button 
                    onClick={handlePersonalCabinetClick}
                    className="text-cosmo-blue hover:text-cosmo-purple transition-colors underline cursor-pointer"
                  >
                    личном кабинете
                  </button>
                  !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DayWithCosmo;