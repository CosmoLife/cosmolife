import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  description?: string;
}

const VideoPlayerModal = ({ isOpen, onClose, videoUrl, title, description }: VideoPlayerModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-0 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          {description && (
            <p className="text-white/70 mt-2">{description}</p>
          )}
        </DialogHeader>
        
        <div className="flex-1 p-2 md:p-4 pt-1 md:pt-2 pb-2 min-h-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-sm mx-auto">
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain bg-black rounded-lg"
              controlsList="nodownload"
              preload="auto"
              playsInline
              webkit-playsinline="true"
              style={{ aspectRatio: '9/16' }}
              onError={(e) => {
                console.error('Video playback error:', e);
              }}
              onLoadStart={() => {
                console.log('Video loading started');
              }}
              onCanPlay={() => {
                console.log('Video can play');
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;