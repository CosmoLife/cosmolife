
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

const PublicOffer = () => {
  const [offerText, setOfferText] = useState('Загрузка...');

  useEffect(() => {
    loadOfferText();
  }, []);

  const loadOfferText = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'offer_text')
        .maybeSingle();

      if (error) {
        console.error('Error loading offer text:', error);
        setOfferText('Ошибка загрузки текста оферты');
        return;
      }

      setOfferText(data?.value || 'Текст публичной оферты не найден');
    } catch (error) {
      console.error('Error loading offer text:', error);
      setOfferText('Ошибка загрузки текста оферты');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-white/60 hover:text-white p-0 h-auto font-normal underline">
          Публичная оферта
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-4">
            ПУБЛИЧНАЯ ОФЕРТА
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="text-white/90 space-y-6">
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {offerText}
            </pre>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PublicOffer;
