import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import VideoPlayerModal from '@/components/VideoPlayerModal';

interface InvestorVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  created_at: string;
}

interface InvestorVideosSectionProps {
  hasInvestments: boolean;
}

const InvestorVideosSection = ({ hasInvestments }: InvestorVideosSectionProps) => {
  const [videos, setVideos] = useState<InvestorVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<InvestorVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasInvestments) {
      fetchVideos();
    }
  }, [hasInvestments]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('investor_videos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!hasInvestments) {
    return null;
  }

  return (
    <>
      <Card className="glass-card border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Play className="w-6 h-6 text-cosmo-blue" />
            Видео обновления по проекту
          </CardTitle>
          <CardDescription className="text-white/70">
            Эксклюзивные видео о ходе разработки Cosmo Life для наших инвесторов. 
            Узнавайте первыми о новых функциях, достижениях команды и планах развития проекта.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-white/70">Загрузка видео...</div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-white/70">Пока нет доступных видео. Следите за обновлениями!</div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Card 
                  key={video.id}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-cosmo-blue/20 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-cosmo-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm line-clamp-2">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                    
                    {video.description && (
                      <p className="text-white/60 text-xs mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(video.created_at)}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-cosmo-blue/20 hover:bg-cosmo-blue/30 text-cosmo-blue border border-cosmo-blue/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(video);
                      }}
                    >
                      Смотреть
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedVideo && (
        <VideoPlayerModal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.video_url}
          title={selectedVideo.title}
          description={selectedVideo.description}
        />
      )}
    </>
  );
};

export default InvestorVideosSection;