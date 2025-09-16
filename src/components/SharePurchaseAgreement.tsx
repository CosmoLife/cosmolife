import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

const SharePurchaseAgreement = () => {
  const [agreementText, setAgreementText] = useState('Загрузка...');

  useEffect(() => {
    loadAgreementText();
  }, []);

  const loadAgreementText = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'share_purchase_agreement')
        .maybeSingle();

      if (error) {
        console.error('Error loading agreement text:', error);
        setAgreementText('Ошибка загрузки текста договора');
        return;
      }

      setAgreementText(data?.value || 'Текст договора о покупке доли не найден');
    } catch (error) {
      console.error('Error loading agreement text:', error);
      setAgreementText('Ошибка загрузки текста договора');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-white/60 hover:text-white p-0 h-auto font-normal underline">
          Договор о покупке доли
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-4">
            ДОГОВОР О ПОКУПКЕ ДОЛИ В COSMO LIFE INC ТМ VINNI
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="text-white/90 space-y-6">
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {agreementText}
            </pre>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SharePurchaseAgreement;