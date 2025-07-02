import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CalendarRange } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
  isOpen: boolean;
  onClose: () => void;
  transactions: IncomeTransaction[];
  totalInvestment: number;
  totalPercentage: number;
}

const IncomeTransactionsModal: React.FC<IncomeTransactionsModalProps> = ({
  isOpen,
  onClose,
  transactions,
  totalInvestment,
  totalPercentage
}) => {
  const [filteredTransactions, setFilteredTransactions] = useState<IncomeTransaction[]>(transactions);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [hashFilter, setHashFilter] = useState('');

  useEffect(() => {
    let filtered = [...transactions];

    // Фильтр по датам
    if (dateFrom) {
      filtered = filtered.filter(t => new Date(t.created_at) >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(t => new Date(t.created_at) <= dateTo);
    }

    // Фильтр по хэшу
    if (hashFilter) {
      filtered = filtered.filter(t => 
        t.transaction_hash?.toLowerCase().includes(hashFilter.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, dateFrom, dateTo, hashFilter]);

  const totalIncomeFiltered = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncomeAll = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Расчет рентабельности
  const totalROI = totalInvestment > 0 ? (totalIncomeAll / totalInvestment) * 100 : 0;
  const annualizedROI = totalROI; // Можно добавить расчет годовой доходности
  
  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setHashFilter('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white neon-text">
            Транзакции начисления дохода
          </DialogTitle>
        </DialogHeader>

        {/* Анализ рентабельности */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-white/60">Общий доход</div>
            <div className="text-lg font-bold text-cosmo-green">
              {totalIncomeAll.toLocaleString()} ₽
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-white/60">Инвестировано</div>
            <div className="text-lg font-bold text-white">
              {totalInvestment.toLocaleString()} ₽
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-white/60">ROI</div>
            <div className="text-lg font-bold text-cosmo-blue">
              {totalROI.toFixed(2)}%
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-sm text-white/60">Доля проекта</div>
            <div className="text-lg font-bold text-cosmo-purple">
              {totalPercentage.toFixed(4)}%
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h3 className="text-white font-bold mb-4">Фильтры</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label className="text-white text-sm">С даты</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label className="text-white text-sm">По дату</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-white text-sm">Хэш транзакции</Label>
              <Input
                value={hashFilter}
                onChange={(e) => setHashFilter(e.target.value)}
                placeholder="Поиск по хэшу..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <Button 
              onClick={clearFilters}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Очистить
            </Button>
          </div>
        </div>

        {/* Итоги по фильтру */}
        {(dateFrom || dateTo || hashFilter) && (
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <div className="text-white">
              <span className="text-white/60">Доход за период: </span>
              <span className="font-bold text-cosmo-green">{totalIncomeFiltered.toLocaleString()} ₽</span>
              <span className="text-white/60 ml-4">Транзакций: </span>
              <span className="font-bold">{filteredTransactions.length}</span>
            </div>
          </div>
        )}

        {/* Таблица транзакций */}
        <div className="border border-white/20 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20">
                <TableHead className="text-white">Дата</TableHead>
                <TableHead className="text-white">Сумма</TableHead>
                <TableHead className="text-white">Хэш транзакции</TableHead>
                <TableHead className="text-white">Заметки</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-white/60 py-8">
                    {transactions.length === 0 
                      ? 'У вас пока нет начислений дохода'
                      : 'Нет транзакций по выбранным фильтрам'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-white/20">
                    <TableCell className="text-white">
                      {format(new Date(transaction.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </TableCell>
                    <TableCell className="text-cosmo-green font-bold">
                      +{transaction.amount.toLocaleString()} ₽
                    </TableCell>
                    <TableCell className="text-white/80 font-mono text-sm">
                      {transaction.transaction_hash || '—'}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {transaction.admin_notes || '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomeTransactionsModal;