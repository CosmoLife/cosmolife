
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const ProfileEditor = () => {
  const { profile, updateProfile, user, session } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    birth_date: profile?.birth_date || '',
    telegram_username: profile?.telegram_username || '',
    whatsapp_number: profile?.whatsapp_number || '',
    usdt_wallet: profile?.usdt_wallet || ''
  });

  useEffect(() => {
    console.log('ProfileEditor: Auth state', { user: !!user, session: !!session, profile: !!profile });
  }, [user, session, profile]);

  if (!user || !session) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border mb-12">
        <div className="text-center text-white">
          <p>Необходимо войти в систему для редактирования профиля</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ProfileEditor: Starting profile update', { formData, profile });
    
    if (!profile) {
      toast({
        title: "Ошибка",
        description: "Профиль не загружен. Попробуйте перезагрузить страницу.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
    } catch (error: any) {
      console.error('ProfileEditor: Error updating profile:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить профиль",
        variant: "destructive"
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isEditing) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cosmo-blue neon-text">
            Профиль
          </h2>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-cosmo-blue hover:bg-cosmo-purple text-white"
          >
            Редактировать
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white/80">ФИО</Label>
            <div className="text-white">{profile?.full_name || 'Не указано'}</div>
          </div>
          <div>
            <Label className="text-white/80">Телефон</Label>
            <div className="text-white">{profile?.phone || 'Не указан'}</div>
          </div>
          <div>
            <Label className="text-white/80">Адрес</Label>
            <div className="text-white">{profile?.address || 'Не указан'}</div>
          </div>
          <div>
            <Label className="text-white/80">Дата рождения</Label>
            <div className="text-white">{profile?.birth_date || 'Не указана'}</div>
          </div>
          <div>
            <Label className="text-white/80">Telegram</Label>
            <div className="text-white">{profile?.telegram_username || 'Не указан'}</div>
          </div>
          <div>
            <Label className="text-white/80">WhatsApp</Label>
            <div className="text-white">{profile?.whatsapp_number || 'Не указан'}</div>
          </div>
          <div className="md:col-span-2">
            <Label className="text-white/80">Кошелек USDT BEP-20</Label>
            <div className="text-white">{profile?.usdt_wallet || 'Не указан'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border mb-12">
      <h2 className="text-2xl font-bold text-cosmo-blue mb-6 neon-text">
        Редактирование профиля
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name" className="text-white mb-2 block">
              ФИО *
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-white mb-2 block">
              Телефон
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          
          <div>
            <Label htmlFor="address" className="text-white mb-2 block">
              Адрес
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="birth_date" className="text-white mb-2 block">
              Дата рождения
            </Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleChange('birth_date', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="telegram_username" className="text-white mb-2 block">
              Telegram (@username)
            </Label>
            <Input
              id="telegram_username"
              value={formData.telegram_username}
              onChange={(e) => handleChange('telegram_username', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="@username"
            />
          </div>
          
          <div>
            <Label htmlFor="whatsapp_number" className="text-white mb-2 block">
              WhatsApp
            </Label>
            <Input
              id="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="usdt_wallet" className="text-white mb-2 block">
              Кошелек USDT BEP-20
            </Label>
            <Input
              id="usdt_wallet"
              value={formData.usdt_wallet}
              onChange={(e) => handleChange('usdt_wallet', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="0x..."
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-cosmo-blue hover:bg-cosmo-purple text-white"
          >
            Сохранить
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
