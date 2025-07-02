
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ProfileEditor from '@/components/ProfileEditor';
import PaymentConfirmation from '@/components/PaymentConfirmation';
import ShareSaleModal from '@/components/ShareSaleModal';
import AdminPanel from '@/components/AdminPanel';
import IncomeTransactionsModal from '@/components/IncomeTransactionsModal';
import InvestmentStats from '@/components/dashboard/InvestmentStats';
import InvestmentForm from '@/components/dashboard/InvestmentForm';
import InvestmentHistory from '@/components/dashboard/InvestmentHistory';
import ShareSaleSection from '@/components/dashboard/ShareSaleSection';
import ShareSaleHistory from '@/components/dashboard/ShareSaleHistory';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { profile, isAdmin } = useProfile();
  const { investments, addInvestment, incomeTransactions, shareSaleRequests } = useInvestment();
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<{id: string, method?: string} | null>(null);
  const [showShareSale, setShowShareSale] = useState(false);
  const [showIncomeTransactions, setShowIncomeTransactions] = useState(false);
  const [investmentHistoryPage, setInvestmentHistoryPage] = useState(1);
  const [shareHistoryPage, setShareHistoryPage] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) return null;

  // Считаем только оплаченные инвестиции (статус 'paid' или 'active')
  const paidInvestments = investments.filter(inv => inv.status === 'paid' || inv.status === 'active');
  const totalInvestment = paidInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  // ИСПРАВЛЕННАЯ ФОРМУЛА: каждые 50,000 рублей = 0.01%
  const totalPercentage = totalInvestment * 0.01 / 50000;
  const totalReceivedIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const yearlyReturn = totalPercentage * 357600000 / 100;
  const potentialReturn = totalPercentage * 178800000000 / 100;

  // Пагинация для историй
  const itemsPerPage = 5;
  
  // Пагинация для истории инвестиций
  const totalInvestmentPages = Math.ceil(investments.length / itemsPerPage);
  const startInvestmentIndex = (investmentHistoryPage - 1) * itemsPerPage;
  const paginatedInvestments = investments.slice(startInvestmentIndex, startInvestmentIndex + itemsPerPage);
  
  // Пагинация для истории заявок на продажу
  const totalSharePages = Math.ceil(shareSaleRequests.length / itemsPerPage);
  const startShareIndex = (shareHistoryPage - 1) * itemsPerPage;
  const paginatedShareRequests = shareSaleRequests.slice(startShareIndex, startShareIndex + itemsPerPage);

  const handleInvestment = async (investmentAmount: number, paymentMethod: 'yoomoney' | 'usdt' | 'card') => {
    if (investmentAmount < 50000) {
      toast({
        title: "Ошибка",
        description: "Минимальная сумма инвестиций 50,000 рублей",
        variant: "destructive"
      });
      return;
    }

    await addInvestment(investmentAmount, paymentMethod);
    
    switch (paymentMethod) {
      case 'yoomoney':
        window.open(`https://yoomoney.ru/to/410019220622751/${investmentAmount}`, '_blank');
        break;
      case 'usdt':
        // Показываем адрес кошелька
        break;
      case 'card':
        // Открываем Telegram или WhatsApp для запроса данных карты
        break;
    }
    
    toast({
      title: "Инвестиция создана!",
      description: "Следуйте инструкциям для оплаты. После оплаты загрузите подтверждение.",
    });
  };

  const handleShareSale = () => {
    if (totalPercentage <= 0) {
      toast({
        title: "Ошибка",
        description: "У вас нет доли для продажи",
        variant: "destructive"
      });
      return;
    }
    
    setShowShareSale(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-neon-gradient bg-clip-text text-transparent neon-text">
                  Личный кабинет инвестора
                </h1>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white"
                >
                  🔄 Обновить
                </Button>
              </div>
              <p className="text-xl text-white/80">
                Добро пожаловать, {user.email}
              </p>
             </div>
             
             {/* Админская панель */}
             {isAdmin && <AdminPanel />}
            
            {/* Компонент редактирования профиля */}
            <ProfileEditor />
            
            {/* Общая статистика */}
            <InvestmentStats
              totalInvestment={totalInvestment}
              totalPercentage={totalPercentage}
              yearlyReturn={yearlyReturn}
              potentialReturn={potentialReturn}
              totalReceivedIncome={totalReceivedIncome}
              onShowIncomeTransactions={() => setShowIncomeTransactions(true)}
            />

            {/* Блок покупки доли (инвестирования) */}
            <InvestmentForm
              showPayment={showPayment}
              onShowPayment={setShowPayment}
              onInvestment={handleInvestment}
            />
            
            {/* История инвестиций */}
            <InvestmentHistory
              investments={investments}
              currentPage={investmentHistoryPage}
              onPageChange={setInvestmentHistoryPage}
              onShowConfirmation={setShowConfirmation}
              itemsPerPage={itemsPerPage}
            />

            {/* Блок продажи доли */}
            <ShareSaleSection
              totalPercentage={totalPercentage}
              onShareSale={handleShareSale}
            />

            {/* История заявок на продажу доли */}
            <ShareSaleHistory
              shareSaleRequests={shareSaleRequests}
              currentPage={shareHistoryPage}
              onPageChange={setShareHistoryPage}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </section>
      
      {/* Модальные окна */}
      {showConfirmation && (
        <PaymentConfirmation
          investmentId={showConfirmation.id}
          paymentMethod={showConfirmation.method}
          onClose={() => setShowConfirmation(null)}
        />
      )}
      
      {showShareSale && (
        <ShareSaleModal
          totalPercentage={totalPercentage}
          onClose={() => setShowShareSale(false)}
        />
      )}

      {showIncomeTransactions && (
            <IncomeTransactionsModal
              isOpen={showIncomeTransactions}
              onClose={() => setShowIncomeTransactions(false)}
              transactions={incomeTransactions}
              totalInvestment={totalInvestment}
              totalPercentage={totalPercentage}
            />
      )}
    </div>
  );
};

export default Dashboard;
