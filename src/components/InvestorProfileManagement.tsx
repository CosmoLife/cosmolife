import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, TrendingUp, DollarSign, Trash2 } from 'lucide-react';

interface InvestorProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  telegram_username?: string;
  whatsapp_number?: string;
  usdt_wallet?: string;
  birth_date?: string;
  role: 'user' | 'admin';
  status: string;
  created_at: string;
  totalInvestment: number;
  totalIncome: number;
  sharePercentage: string;
}

interface InvestorProfileManagementProps {
  investors: InvestorProfile[];
  onInvestorUpdated: () => void;
}

const InvestorProfileManagement: React.FC<InvestorProfileManagementProps> = ({ investors, onInvestorUpdated }) => {
  const [editingInvestor, setEditingInvestor] = useState<InvestorProfile | null>(null);
  const [formData, setFormData] = useState<Partial<InvestorProfile>>({});
  const [incomeData, setIncomeData] = useState({ amount: '', hash: '', notes: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditInvestor = (investor: InvestorProfile) => {
    setEditingInvestor(investor);
    setFormData({
      full_name: investor.full_name || '',
      email: investor.email || '',
      phone: investor.phone || '',
      address: investor.address || '',
      telegram_username: investor.telegram_username || '',
      whatsapp_number: investor.whatsapp_number || '',
      usdt_wallet: investor.usdt_wallet || '',
      birth_date: investor.birth_date || '',
      role: investor.role,
      status: investor.status || 'active'
    });
    setIsDialogOpen(true);
  };

  const handleAddIncome = (investor: InvestorProfile) => {
    setEditingInvestor(investor);
    setIncomeData({ amount: '', hash: '', notes: '' });
    setIsIncomeDialogOpen(true);
  };

  const handleUpdateInvestor = async () => {
    if (!editingInvestor) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', editingInvestor.id);

      if (error) throw error;

      toast({
        title: "Инвестор обновлен",
        description: "Данные инвестора успешно сохранены",
      });

      setIsDialogOpen(false);
      setEditingInvestor(null);
      setFormData({});
      onInvestorUpdated();
    } catch (error) {
      console.error('Error updating investor:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные инвестора",
        variant: "destructive"
      });
    }
  };

  const handleAddIncomeTransaction = async () => {
    if (!editingInvestor || !incomeData.amount) return;

    try {
      const { error } = await supabase
        .from('income_transactions')
        .insert({
          user_id: editingInvestor.id,
          amount: parseFloat(incomeData.amount),
          transaction_hash: incomeData.hash || null,
          admin_notes: incomeData.notes || `Начислен доход администратором`
        });

      if (error) throw error;

      toast({
        title: "Доход начислен",
        description: "Доход успешно начислен инвестору",
      });

      setIsIncomeDialogOpen(false);
      setEditingInvestor(null);
      setIncomeData({ amount: '', hash: '', notes: '' });
      onInvestorUpdated();
    } catch (error) {
      console.error('Error adding income:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось начислить доход",
        variant: "destructive"
      });
    }
  };

  const handleSuspendInvestor = async (investorId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', investorId);

      if (error) throw error;

      toast({
        title: newStatus === 'suspended' ? "Инвестор заблокирован" : "Инвестор разблокирован",
        description: `Статус инвестора изменен на ${newStatus === 'suspended' ? 'заблокирован' : 'активный'}`,
      });

      onInvestorUpdated();
    } catch (error) {
      console.error('Error updating investor status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус инвестора",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInvestor = async (investorId: string, investorName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить инвестора "${investorName}"? Это действие нельзя отменить и удалит все связанные инвестиции и данные.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', investorId);

      if (error) throw error;

      toast({
        title: "Инвестор удален",
        description: "Инвестор успешно удален из системы",
      });

      onInvestorUpdated();
    } catch (error) {
      console.error('Error deleting investor:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить инвестора",
        variant: "destructive"
      });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Управление профилями инвесторов</h3>
      
      {investors.map((investor) => (
        <div key={investor.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-white"><strong>Имя:</strong> {investor.full_name || 'Не указано'}</p>
              <p className="text-white"><strong>Email:</strong> {investor.email || 'Не указано'}</p>
              <p className="text-white"><strong>Телефон:</strong> {investor.phone || 'Не указано'}</p>
              <p className="text-white"><strong>Telegram:</strong> {investor.telegram_username || 'Не указано'}</p>
            </div>
            <div>
              <p className="text-white"><strong>Общая инвестиция:</strong> {investor.totalInvestment?.toLocaleString()} ₽</p>
              <p className="text-white"><strong>Доля:</strong> {investor.sharePercentage}%</p>
              <p className="text-white"><strong>Полученный доход:</strong> {investor.totalIncome?.toLocaleString()} ₽</p>
              <p className="text-white"><strong>USDT кошелек:</strong> {investor.usdt_wallet || 'Не указано'}</p>
            </div>
            <div>
              <p className="text-white"><strong>Роль:</strong> {investor.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
              <p className="text-white">
                <strong>Статус:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  investor.status === 'suspended' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {investor.status === 'suspended' ? 'Заблокирован' : 'Активный'}
                </span>
              </p>
              <p className="text-white"><strong>Дата регистрации:</strong> {new Date(investor.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Dialog open={isDialogOpen && editingInvestor?.id === investor.id} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleEditInvestor(investor)}
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Редактирование профиля инвестора</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name" className="text-white">Полное имя</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name || ''}
                      onChange={(e) => handleFormChange('full_name', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-white">Телефон</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="birth_date" className="text-white">Дата рождения</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date || ''}
                      onChange={(e) => handleFormChange('birth_date', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telegram_username" className="text-white">Telegram</Label>
                    <Input
                      id="telegram_username"
                      value={formData.telegram_username || ''}
                      onChange={(e) => handleFormChange('telegram_username', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="whatsapp_number" className="text-white">WhatsApp</Label>
                    <Input
                      id="whatsapp_number"
                      value={formData.whatsapp_number || ''}
                      onChange={(e) => handleFormChange('whatsapp_number', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="usdt_wallet" className="text-white">USDT кошелек</Label>
                    <Input
                      id="usdt_wallet"
                      value={formData.usdt_wallet || ''}
                      onChange={(e) => handleFormChange('usdt_wallet', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="text-white">Роль</Label>
                    <Select value={formData.role} onValueChange={(value) => handleFormChange('role', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="user" className="text-white">Пользователь</SelectItem>
                        <SelectItem value="admin" className="text-white">Администратор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-white">Адрес</Label>
                    <Textarea
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleUpdateInvestor}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Сохранить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isIncomeDialogOpen && editingInvestor?.id === investor.id} onOpenChange={setIsIncomeDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleAddIncome(investor)}
                  variant="outline"
                  size="sm"
                  className="border-green-400 text-green-400 hover:bg-green-400/10"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Начислить доход
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Начислить доход</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-white">Сумма (₽)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={incomeData.amount}
                      onChange={(e) => setIncomeData(prev => ({ ...prev, amount: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Введите сумму"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hash" className="text-white">Хэш транзакции (опционально)</Label>
                    <Input
                      id="hash"
                      value={incomeData.hash}
                      onChange={(e) => setIncomeData(prev => ({ ...prev, hash: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Введите хэш транзакции"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="text-white">Примечания</Label>
                    <Textarea
                      id="notes"
                      value={incomeData.notes}
                      onChange={(e) => setIncomeData(prev => ({ ...prev, notes: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Дополнительные примечания"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    onClick={() => setIsIncomeDialogOpen(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleAddIncomeTransaction}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!incomeData.amount}
                  >
                    Начислить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              onClick={() => handleSuspendInvestor(investor.id, investor.status)}
              variant={investor.status === 'suspended' ? 'default' : 'destructive'}
              size="sm"
              className={investor.status === 'suspended' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
              }
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {investor.status === 'suspended' ? 'Разблокировать' : 'Заблокировать'}
            </Button>
            
            <Button
              onClick={() => handleDeleteInvestor(investor.id, investor.full_name || investor.email)}
              variant="destructive"
              size="sm"
              className="bg-red-800 hover:bg-red-900 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить
            </Button>
          </div>
        </div>
      ))}
      
      {investors.length === 0 && (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Инвесторы не найдены</p>
        </div>
      )}
    </div>
  );
};

export default InvestorProfileManagement;