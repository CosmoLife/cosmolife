import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching VINNI Factory metrics...');
    
    // Получаем данные из VINNI Factory API
    const factoryResponse = await fetch('https://iphktqakqfuucsismcgq.supabase.co/functions/v1/statistics-api');
    
    if (!factoryResponse.ok) {
      throw new Error(`Factory API error: ${factoryResponse.statusText}`);
    }

    const factoryData = await factoryResponse.json();
    console.log('Factory data received:', factoryData);

    // Формируем метрики для записи
    const today = new Date().toISOString().split('T')[0];
    
    // Метрики из VINNI Factory
    const factoryMetrics = {
      dau: factoryData.dau || 0,
      mau: factoryData.mau || 0,
      new_downloads: factoryData.new_downloads || 0,
      total_downloads: factoryData.total_downloads || 0,
      avg_session_duration: factoryData.avg_session_duration || 0,
      sessions_per_user: factoryData.sessions_per_user || 0,
      retention_day1: factoryData.retention_day1 || 0,
      retention_day7: factoryData.retention_day7 || 0,
      retention_day30: factoryData.retention_day30 || 0,
      churn_rate: factoryData.churn_rate || 0,
      revenue: factoryData.revenue || 0,
      arpu: factoryData.arpu || 0,
      arppu: factoryData.arppu || 0,
      paying_users: factoryData.paying_users || 0,
      conversion_rate: factoryData.conversion_rate || 0,
    };

    // Проверяем, есть ли уже запись за сегодня
    const { data: existingData } = await supabase
      .from('app_metrics')
      .select('id')
      .eq('date', today)
      .maybeSingle();

    if (existingData) {
      // Обновляем существующую запись
      const { error: updateError } = await supabase
        .from('app_metrics')
        .update({
          ...factoryMetrics,
          updated_at: new Date().toISOString(),
        })
        .eq('date', today);

      if (updateError) throw updateError;
      console.log('Metrics updated for', today);
    } else {
      // Создаём новую запись
      const { error: insertError } = await supabase
        .from('app_metrics')
        .insert({
          date: today,
          ...factoryMetrics,
        });

      if (insertError) throw insertError;
      console.log('Metrics inserted for', today);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Metrics synced successfully',
        date: today,
        metrics: factoryMetrics,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error syncing metrics:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
