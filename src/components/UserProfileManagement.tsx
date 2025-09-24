import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, User } from 'lucide-react';

interface UserProfile {
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
}

interface UserProfileManagementProps {
  users: UserProfile[];
  onUserUpdated: () => void;
}

const UserProfileManagement: React.FC<UserProfileManagementProps> = ({ users, onUserUpdated }) => {
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      telegram_username: user.telegram_username || '',
      whatsapp_number: user.whatsapp_number || '',
      usdt_wallet: user.usdt_wallet || '',
      birth_date: user.birth_date || '',
      role: user.role,
      status: user.status || 'active'
    });
    setIsDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: "Пользователь обновлен",
        description: "Данные пользователя успешно сохранены",
      });

      setIsDialogOpen(false);
      setEditingUser(null);
      setFormData({});
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные пользователя",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить пользователя "${userName}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Пользователь удален",
        description: "Пользователь успешно удален из системы",
      });

      onUserUpdated();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
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
      <h3 className="text-xl font-bold text-white mb-4">Управление профилями пользователей</h3>
      
      {users.map((user) => (
        <div key={user.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-white"><strong>Имя:</strong> {user.full_name || 'Не указано'}</p>
              <p className="text-white"><strong>Email:</strong> {user.email || 'Не указано'}</p>
              <p className="text-white"><strong>Телефон:</strong> {user.phone || 'Не указано'}</p>
            </div>
            <div>
              <p className="text-white"><strong>Telegram:</strong> {user.telegram_username || 'Не указано'}</p>
              <p className="text-white"><strong>WhatsApp:</strong> {user.whatsapp_number || 'Не указано'}</p>
              <p className="text-white"><strong>USDT кошелек:</strong> {user.usdt_wallet || 'Не указано'}</p>
            </div>
            <div>
              <p className="text-white"><strong>Роль:</strong> {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
              <p className="text-white"><strong>Статус:</strong> {user.status || 'active'}</p>
              <p className="text-white"><strong>Дата регистрации:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isDialogOpen && editingUser?.id === user.id} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleEditUser(user)}
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
                  <DialogTitle className="text-white">Редактирование профиля</DialogTitle>
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
                  
                  <div>
                    <Label htmlFor="status" className="text-white">Статус</Label>
                    <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="active" className="text-white">Активный</SelectItem>
                        <SelectItem value="suspended" className="text-white">Заблокирован</SelectItem>
                        <SelectItem value="pending" className="text-white">Ожидает подтверждения</SelectItem>
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
                    onClick={handleUpdateUser}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Сохранить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить
            </Button>
          </div>
        </div>
      ))}
      
      {users.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Пользователи не найдены</p>
        </div>
      )}
    </div>
  );
};

export default UserProfileManagement;