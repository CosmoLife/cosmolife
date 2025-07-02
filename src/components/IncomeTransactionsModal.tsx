
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface IncomeTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_hash?: string;
  admin_notes?: string;
  created_at: string;
  created_by?: string;
}

interface IncomeTransactionsModalProps {
  transactions: IncomeTransaction[];
  totalInvestment: number;
  onClose: () => void;
}

const IncomeTransactionsModal: React.FC<IncomeTransactionsModalProps> = ({
  transactions,
  totalInvestment,
  onClose
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Фильтрация транзакций по датам
  const filteredTransactions = useMemo(() => {
    if (!startDate && !endDate) return transactions;
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && transactionDate < start) return false;
      if (end && transactionDate > end) return false;
      
      return true;
    });
  }, [transactions, startDate, endDate]);

  // Анализ рентабельности
  const analysis = useMemo(() => {
    const totalIncome = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransaction = filteredTransactions.length > 0 ? totalIncome / filteredTransactions.length : 0;
    const profitability = totalInvestment > 0 ? (totalIncome / totalInvestment) * 100 : 0;
    
    // Анализ по месяцам
    const monthlyData = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { amount: 0, count: 0 };
      }
      
      acc[monthKey].amount += transaction.amount;
      acc[monthKey].count += 1;
      
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return {
      totalIncome,
      averageTransaction,
      profitability,
      monthlyData
    };
  }, [filteredTransactions, totalInvestment]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">История доходов</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Фильтры по дате */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
            <div>
              <Label htmlFor="startDate" className="text-white mb-2 block">
                <Calendar className="w-4 h-4 inline mr-2" />
                Дата начала
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-white mb-2 block">
                <Calendar className="w-4 h-4 inline mr-2" />
                Дата окончания
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Анализ рентабельности */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-cosmo-blue/20 to-cosmo-purple/20 rounded-lg p-4 border border-cosmo-blue/30">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-cosmo-blue" />
                <span className="text-cosmo-blue font-bold text-lg">
                  {formatCurrency(analysis.totalIncome)}
                </span>
              </div>
              <p className="text-white/80 text-sm">Общий доход</p>
            </div>

            <div className="bg-gradient-to-br from-cosmo-green/20 to-cosmo-blue/20 rounded-lg p-4 border border-cosmo-green/30">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-cosmo-green" />
                <span className="text-cosmo-green font-bold text-lg">
                  {analysis.profitability.toFixed(2)}%
                </span>
              </div>
              <p className="text-white/80 text-sm">Рентабельность</p>
            </div>

            <div className="bg-gradient-to-br from-cosmo-purple/20 to-cosmo-green/20 rounded-lg p-4 border border-cosmo-purple/30">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-cosmo-purple" />
                <span className="text-cosmo-purple font-bold text-lg">
                  {formatCurrency(analysis.averageTransaction)}
                </span>
              </div>
              <p className="text-white/80 text-sm">Средняя выплата</p>
            </div>

            <div className="bg-gradient-to-br from-cosmo-blue/20 to-cosmo-green/20 rounded-lg p-4 border border-cosmo-blue/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cosmo-blue font-bold text-2xl">
                  {filteredTransactions.length}
                </span>
              </div>
              <p className="text-white/80 text-sm">Всего операций</p>
            </div>
          </div>

          {/* Месячная статистика */}
          {Object.keys(analysis.monthlyData).length > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-4">Статистика по месяцам</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(analysis.monthlyData)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([month, data]) => (
                    <div key={month} className="bg-slate-700/50 rounded p-3">
                      <div className="text-white font-semibold">{month}</div>
                      <div className="text-cosmo-green text-sm">
                        {formatCurrency(data.amount)}
                      </div>
                      <div className="text-white/60 text-xs">
                        {data.count} операций
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Список транзакций */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">
              Транзакции ({filteredTransactions.length})
            </h3>
            
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                Нет транзакций за выбранный период
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-lg font-bold text-cosmo-green">
                        +{formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-white/60 text-sm">
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                    
                    {transaction.transaction_hash && (
                      <div className="text-sm text-white/80 mb-1">
                        <strong>Хэш транзакции:</strong>{' '}
                        <span className="font-mono text-cosmo-blue">
                          {transaction.transaction_hash}
                        </span>
                      </div>
                    )}
                    
                    {transaction.admin_notes && (
                      <div className="text-sm text-white/60">
                        <strong>Примечание:</strong> {transaction.admin_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/20">
          <Button
            onClick={onClose}
            className="w-full bg-cosmo-blue hover:bg-cosmo-purple text-white"
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomeTransactionsModal;
