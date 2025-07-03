import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

interface Screenshot {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
}

const AppScreenshots = () => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const { data, error } = await supabase
          .from('app_screenshots')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setScreenshots(data || []);
      } catch (error) {
        console.error('Error fetching screenshots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-white">Загрузка скриншотов...</div>
          </div>
        </div>
      </section>
    );
  }

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-neon-gradient bg-clip-text text-transparent neon-text mb-4">
              Мобильное приложение Cosmo Life
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Управляйте своими инвестициями в удобном мобильном приложении
            </p>
          </div>

          <div className="relative">
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {screenshots.map((screenshot) => (
                  <CarouselItem key={screenshot.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <Card className="glass-effect border-white/10 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="aspect-[9/16] relative overflow-hidden">
                            <img
                              src={screenshot.image_url}
                              alt={screenshot.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {screenshot.title}
                            </h3>
                            {screenshot.description && (
                              <p className="text-white/70 text-sm">
                                {screenshot.description}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="glass-effect border-white/20 text-white hover:bg-white/10" />
              <CarouselNext className="glass-effect border-white/20 text-white hover:bg-white/10" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppScreenshots;