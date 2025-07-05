import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import { Play, Upload, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';

interface InvestorVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  video_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

const AdminVideoSection = () => {
  const { 
    getAllInvestorVideos,
    uploadInvestorVideo,
    updateVideoStatus,
    deleteInvestorVideo
  } = useAdmin();
  
  const [videos, setVideos] = useState<InvestorVideo[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const videosData = await getAllInvestorVideos();
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список видео",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile || !videoTitle) {
      toast({
        title: "Ошибка",
        description: "Выберите файл и укажите название",
        variant: "destructive"
      });
      return;
    }

    // Проверяем размер файла (макс 100MB)
    if (videoFile.size > 100 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 100MB",
        variant: "destructive"
      });
      return;
    }

    // Проверяем тип файла
    if (!videoFile.type.startsWith('video/')) {
      toast({
        title: "Ошибка",
        description: "Можно загружать только видео файлы",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadInvestorVideo(videoFile, videoTitle, videoDescription);
      
      // Очищаем форму
      setVideoFile(null);
      setVideoTitle('');
      setVideoDescription('');
      
      // Обновляем список видео
      await fetchVideos();
      
      toast({
        title: "Видео загружено!",
        description: "Видео успешно добавлено и доступно инвесторам",
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить видео",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatusToggle = async (videoId: string, currentStatus: boolean) => {
    try {
      await updateVideoStatus(videoId, !currentStatus);
      await fetchVideos();
      
      toast({
        title: "Статус обновлен",
        description: `Видео ${!currentStatus ? 'активировано' : 'деактивировано'}`,
      });
    } catch (error) {
      console.error('Error updating video status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус видео",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это видео? Это действие нельзя отменить.')) {
      return;
    }

    try {
      await deleteInvestorVideo(videoId);
      await fetchVideos();
      
      toast({
        title: "Видео удалено",
        description: "Видео успешно удалено",
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить видео",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileSizeString = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Форма загрузки видео */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Загрузить новое видео
          </CardTitle>
          <CardDescription className="text-white/70">
            Загрузите видео обновления для инвесторов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVideoUpload} className="space-y-4">
            <div>
              <Label htmlFor="video-file" className="text-white">Видео файл (максимум 100MB)</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="bg-white/10 border-white/20 text-white"
                disabled={isUploading}
              />
              {videoFile && (
                <p className="text-sm text-white/70 mt-1">
                  Выбран файл: {videoFile.name} ({getFileSizeString(videoFile.size)})
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="video-title" className="text-white">Название видео *</Label>
              <Input
                id="video-title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Например: Обновление разработки - Март 2025"
                className="bg-white/10 border-white/20 text-white"
                disabled={isUploading}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="video-description" className="text-white">Описание (необязательно)</Label>
              <Textarea
                id="video-description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Краткое описание содержания видео..."
                className="bg-white/10 border-white/20 text-white"
                disabled={isUploading}
                rows={3}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isUploading || !videoFile || !videoTitle}
              className="bg-cosmo-blue hover:bg-cosmo-blue/80"
            >
              {isUploading ? 'Загрузка...' : 'Загрузить видео'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Список загруженных видео */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="w-5 h-5" />
            Загруженные видео ({videos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-white/70">Загрузка видео...</div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-white/70">Пока нет загруженных видео</div>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{video.title}</h4>
                      {video.description && (
                        <p className="text-white/70 text-sm mb-2">{video.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(video.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={video.is_active ? "default" : "secondary"}
                        className={video.is_active ? "bg-green-600" : "bg-gray-600"}
                      >
                        {video.is_active ? 'Активно' : 'Скрыто'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusToggle(video.id, video.is_active)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {video.is_active ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Скрыть
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Показать
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(video.video_url, '_blank')}
                      className="border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Просмотр
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(video.id)}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Удалить
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

export default AdminVideoSection;