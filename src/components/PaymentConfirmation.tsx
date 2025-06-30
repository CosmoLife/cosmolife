
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentConfirmationProps {
  investmentId: string;
  onClose: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ investmentId, onClose }) => {
  const { uploadPaymentConfirmation } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Ошибка",
        description: "Выберите файл для загрузки",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      await uploadPaymentConfirmation(investmentId, file);
      toast({
        title: "Файл загружен",
        description: "Подтверждение оплаты успешно отправлено",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить файл",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 neon-border">
        <h3 className="text-2xl font-bold text-cosmo-blue mb-6 neon-text">
          Загрузить подтверждение оплаты
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="payment-file" className="text-white mb-2 block">
              Выберите файл (скриншот, чек, справка)
            </Label>
            <Input
              id="payment-file"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          
          {file && (
            <div className="text-sm text-white/80">
              Выбран файл: {file.name}
            </div>
          )}
          
          <div className="flex gap-4 mt-6">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-cosmo-blue hover:bg-cosmo-purple text-white flex-1"
            >
              {uploading ? 'Загрузка...' : 'Загрузить'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
