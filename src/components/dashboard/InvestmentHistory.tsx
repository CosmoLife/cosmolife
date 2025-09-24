import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Investment {
  id: string;
  amount: number;
  created_at: string;
  payment_method?: string;
  received_income?: number;
  status: string;
  admin_notes?: string;
}

interface InvestmentHistoryProps {
  investments: Investment[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onShowConfirmation: (data: {id: string, method?: string}) => void;
  itemsPerPage: number;
}

const InvestmentHistory: React.FC<InvestmentHistoryProps> = ({
  investments,
  currentPage,
  onPageChange,
  onShowConfirmation,
  itemsPerPage
}) => {
  const totalPages = Math.ceil(investments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvestments = investments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-cosmo-purple neon-text">
          История инвестиций
        </h2>
        {investments.length > itemsPerPage && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="border-white/20 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white text-sm">
              {currentPage} из {totalPages}
            </span>
            <Button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="border-white/20 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {investments.length === 0 ? (
        <p className="text-white/80 text-center py-8">
          У вас пока нет инвестиций. Создайте первую инвестицию выше!
        </p>
      ) : (
        <div className="space-y-4">
          {paginatedInvestments.map((investment) => (
            <div
              key={investment.id}
              className="bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-white mb-1">
                    {investment.amount.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-white/60">
                    Доля: {(investment.amount * 0.01 / 100000).toFixed(4)}% • {' '}
                    {new Date(investment.created_at).toLocaleDateString('ru-RU')}
                  </div>
                  {investment.payment_method && (
                    <div className="text-sm text-cosmo-blue">
                      Способ оплаты: {
                        investment.payment_method === 'yoomoney' ? 'ЮMoney' : 
                        investment.payment_method === 'usdt' ? 'USDT' :
                        'Карта'
                      }
                    </div>
                  )}
                  {investment.received_income && investment.received_income > 0 && (
                    <div className="text-sm text-cosmo-green">
                      Полученный доход: {investment.received_income.toLocaleString()} ₽
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    investment.status === 'active' 
                      ? 'bg-cosmo-green/20 text-cosmo-green' 
                      : investment.status === 'paid'
                      ? 'bg-cosmo-blue/20 text-cosmo-blue'
                      : investment.status === 'under_review'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : investment.status === 'rejected'
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {investment.status === 'active' 
                      ? 'Активно' 
                      : investment.status === 'paid'
                      ? 'Оплачено'
                      : investment.status === 'under_review'
                      ? 'На проверке'
                      : investment.status === 'rejected'
                      ? 'Отклонено'
                      : 'Ожидает оплаты'
                    }
                  </div>
                  
                  {investment.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => onShowConfirmation({
                        id: investment.id,
                        method: investment.payment_method
                      })}
                      className="bg-cosmo-purple hover:bg-cosmo-blue text-white"
                    >
                      Загрузить подтверждение
                    </Button>
                  )}
                </div>
              </div>
              
              {investment.admin_notes && (
                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    <strong>Заметка администратора:</strong> {investment.admin_notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestmentHistory;