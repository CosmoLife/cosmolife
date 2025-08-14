import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

interface AdminEmail {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

const AdminEmailsSection = () => {
  const { getAllAdminEmails, addAdminEmail, updateAdminEmailStatus, deleteAdminEmail } = useAdmin();
  const { toast } = useToast();
  const [emails, setEmails] = useState<AdminEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      const emailsData = await getAllAdminEmails();
      setEmails(emailsData);
    } catch (error) {
      console.error('Error loading admin emails:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить email адреса",
        variant: "destructive"
      });
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите email адрес",
        variant: "destructive"
      });
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Ошибка",
        description: "Введите корректный email адрес",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await addAdminEmail(newEmail);
      setNewEmail('');
      await loadEmails();
      toast({
        title: "Email добавлен",
        description: "Новый email адрес успешно добавлен",
      });
    } catch (error: any) {
      console.error('Error adding email:', error);
      if (error.message?.includes('duplicate')) {
        toast({
          title: "Ошибка",
          description: "Этот email уже добавлен",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось добавить email",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateAdminEmailStatus(id, !currentStatus);
      await loadEmails();
      toast({
        title: "Статус обновлен",
        description: `Email ${!currentStatus ? 'активирован' : 'деактивирован'}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот email?')) {
      return;
    }

    try {
      await deleteAdminEmail(id);
      await loadEmails();
      toast({
        title: "Email удален",
        description: "Email адрес успешно удален",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить email",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-cosmo-blue flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email адреса для уведомлений
        </CardTitle>
        <CardDescription className="text-white/60">
          Управление email адресами админов для получения уведомлений о новых заявках
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Добавление нового email */}
        <div className="space-y-2">
          <Label htmlFor="new-email" className="text-white">
            Добавить новый email
          </Label>
          <div className="flex gap-2">
            <Input
              id="new-email"
              type="email"
              placeholder="admin@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddEmail();
                }
              }}
            />
            <Button 
              onClick={handleAddEmail}
              disabled={loading}
              className="bg-cosmo-blue hover:bg-cosmo-blue/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </div>

        {/* Список email адресов */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Текущие email адреса ({emails.length})</h4>
          
          {emails.length === 0 ? (
            <div className="text-white/60 text-center py-4 border border-white/10 rounded-lg">
              Нет добавленных email адресов
            </div>
          ) : (
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-cosmo-blue" />
                    <span className="text-white">{email.email}</span>
                    <Badge 
                      variant={email.is_active ? "default" : "secondary"}
                      className={email.is_active ? "bg-green-600" : "bg-gray-600"}
                    >
                      {email.is_active ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStatus(email.id, email.is_active)}
                      className="text-white hover:bg-white/10"
                    >
                      {email.is_active ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteEmail(email.id)}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Информация о тестировании */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-200 text-sm">
            <strong>Как это работает:</strong> При создании новой заявки на инвестицию или продажу доли, 
            на все активные email адреса будут автоматически отправлены уведомления с деталями заявки.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminEmailsSection;