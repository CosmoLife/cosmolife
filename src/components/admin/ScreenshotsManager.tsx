import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload, Save } from 'lucide-react';

interface Screenshot {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  image_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const ScreenshotsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newScreenshot, setNewScreenshot] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  useEffect(() => {
    fetchScreenshots();
  }, []);

  const fetchScreenshots = async () => {
    try {
      const { data, error } = await supabase
        .from('app_screenshots')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setScreenshots(data || []);
    } catch (error) {
      console.error('Error fetching screenshots:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить скриншоты",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewScreenshot(prev => ({ ...prev, file }));
    }
  };

  const uploadScreenshot = async () => {
    if (!newScreenshot.file || !newScreenshot.title.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните название и выберите изображение",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Загрузка файла в storage
      const fileName = `${Date.now()}-${newScreenshot.file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('app-screenshots')
        .upload(fileName, newScreenshot.file);

      if (uploadError) throw uploadError;

      // Получение публичного URL
      const { data: urlData } = supabase.storage
        .from('app-screenshots')
        .getPublicUrl(uploadData.path);

      // Сохранение записи в базу данных
      const { error: dbError } = await supabase
        .from('app_screenshots')
        .insert({
          title: newScreenshot.title.trim(),
          description: newScreenshot.description.trim() || null,
          image_url: urlData.publicUrl,
          image_name: fileName,
          display_order: screenshots.length,
          created_by: user?.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Успешно!",
        description: "Скриншот загружен"
      });

      setNewScreenshot({ title: '', description: '', file: null });
      fetchScreenshots();
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить скриншот",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteScreenshot = async (id: string, imageName: string) => {
    try {
      // Удаление файла из storage
      await supabase.storage
        .from('app-screenshots')
        .remove([imageName]);

      // Удаление записи из базы данных
      const { error } = await supabase
        .from('app_screenshots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Скриншот удален"
      });

      fetchScreenshots();
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить скриншот",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('app_screenshots')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: `Скриншот ${!isActive ? 'активирован' : 'деактивирован'}`
      });

      fetchScreenshots();
    } catch (error) {
      console.error('Error updating screenshot:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить скриншот",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-white">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Форма добавления нового скриншота */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Добавить новый скриншот
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Название скриншота"
              value={newScreenshot.title}
              onChange={(e) => setNewScreenshot(prev => ({ ...prev, title: e.target.value }))}
              className="bg-black/20 border-white/20 text-white"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Описание (необязательно)"
              value={newScreenshot.description}
              onChange={(e) => setNewScreenshot(prev => ({ ...prev, description: e.target.value }))}
              className="bg-black/20 border-white/20 text-white"
              rows={3}
            />
          </div>
          
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-black/20 border-white/20 text-white file:bg-cosmo-blue file:text-white file:border-0"
            />
          </div>
          
          <Button
            onClick={uploadScreenshot}
            disabled={uploading}
            className="bg-cosmo-blue hover:bg-cosmo-purple"
          >
            <Save className="w-4 h-4 mr-2" />
            {uploading ? 'Загрузка...' : 'Сохранить скриншот'}
          </Button>
        </CardContent>
      </Card>

      {/* Список существующих скриншотов */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            Управление скриншотами ({screenshots.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {screenshots.length === 0 ? (
            <p className="text-white/60">Скриншоты не найдены</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.map((screenshot) => (
                <div key={screenshot.id} className="glass-effect border-white/10 rounded-lg p-4">
                  <div className="aspect-[9/16] relative overflow-hidden rounded-lg mb-3">
                    <img
                      src={screenshot.image_url}
                      alt={screenshot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="text-white font-semibold mb-1">{screenshot.title}</h3>
                  {screenshot.description && (
                    <p className="text-white/70 text-sm mb-3">{screenshot.description}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={screenshot.is_active ? "destructive" : "default"}
                      onClick={() => toggleActive(screenshot.id, screenshot.is_active)}
                      className="flex-1"
                    >
                      {screenshot.is_active ? 'Скрыть' : 'Показать'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteScreenshot(screenshot.id, screenshot.image_name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreenshotsManager;