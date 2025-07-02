import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShareSaleRequest {
  id: string;
  share_percentage: number;
  usdt_wallet: string;
  created_at: string;
  status: string;
  admin_notes?: string;
}

interface ShareSaleHistoryProps {
  shareSaleRequests: ShareSaleRequest[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

const ShareSaleHistory: React.FC<ShareSaleHistoryProps> = ({
  shareSaleRequests,
  currentPage,
  onPageChange,
  itemsPerPage
}) => {
  const totalPages = Math.ceil(shareSaleRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShareRequests = shareSaleRequests.slice(startIndex, startIndex + itemsPerPage);

  if (shareSaleRequests.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-red-400 neon-text">
          Заявки на продажу доли
        </h2>
        {shareSaleRequests.length > itemsPerPage && (
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
      
      <div className="space-y-4">
        {paginatedShareRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-white mb-1">
                  Продажа {request.share_percentage.toFixed(4)}% доли
                </div>
                <div className="text-sm text-white/60 mb-2">
                  Кошелек USDT: {request.usdt_wallet}
                </div>
                <div className="text-sm text-white/60">
                  Дата подачи: {new Date(request.created_at).toLocaleDateString('ru-RU')}
                </div>
                {request.admin_notes && (
                  <div className="text-sm text-white/80 mt-2 bg-white/5 p-2 rounded">
                    <strong>Комментарий администратора:</strong> {request.admin_notes}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
                  request.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/50' :
                  'bg-red-500/20 text-red-300 border border-red-500/50'
                }`}>
                  {request.status === 'pending' ? 'Ожидает рассмотрения' :
                   request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                </div>
                {request.status === 'approved' && (
                  <div className="text-xs text-green-300 text-center">
                    Доля будет продана автоматически
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-white/60 bg-white/5 p-4 rounded-lg">
        <strong>Информация:</strong> При одобрении заявки ваша доля будет автоматически продана следующему инвестору. 
        Средства поступят на указанный USDT кошелек за вычетом комиссии 20%.
      </div>
    </div>
  );
};

export default ShareSaleHistory;