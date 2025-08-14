import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'investment' | 'share_sale';
  data: {
    id: string;
    user_id: string;
    amount?: number;
    percentage?: number;
    payment_method?: string;
    share_percentage?: number;
    usdt_wallet?: string;
    created_at: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Admin notification request received');
    
    const { type, data }: NotificationRequest = await req.json();
    console.log('Notification type:', type, 'Data:', data);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get active admin emails
    const { data: adminEmails, error: emailError } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('is_active', true);

    if (emailError) {
      console.error('Error fetching admin emails:', emailError);
      return new Response(JSON.stringify({ error: 'Failed to fetch admin emails' }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!adminEmails || adminEmails.length === 0) {
      console.log('No active admin emails found');
      return new Response(JSON.stringify({ message: 'No admin emails configured' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get user profile for user info
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', data.user_id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    const userName = userProfile?.full_name || 'Неизвестный пользователь';
    const userEmail = userProfile?.email || 'Email не указан';
    const userPhone = userProfile?.phone || 'Телефон не указан';

    // Prepare email content based on notification type
    let subject: string;
    let html: string;

    if (type === 'investment') {
      subject = `Новая заявка на инвестицию - ${data.amount} руб.`;
      html = `
        <h2>Новая заявка на инвестицию</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Детали инвестиции:</h3>
          <p><strong>Сумма:</strong> ${data.amount} руб.</p>
          <p><strong>Процент:</strong> ${data.percentage}%</p>
          <p><strong>Способ оплаты:</strong> ${data.payment_method}</p>
          <p><strong>Дата создания:</strong> ${new Date(data.created_at).toLocaleString('ru-RU')}</p>
        </div>
        <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Информация о пользователе:</h3>
          <p><strong>Имя:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Телефон:</strong> ${userPhone}</p>
          <p><strong>ID пользователя:</strong> ${data.user_id}</p>
        </div>
        <p style="margin-top: 30px;">
          <a href="https://kesiglejxnnnxfovfetm.supabase.co/dashboard" 
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Перейти в админ-панель
          </a>
        </p>
      `;
    } else {
      subject = `Новая заявка на продажу доли - ${data.share_percentage}%`;
      html = `
        <h2>Новая заявка на продажу доли</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Детали продажи:</h3>
          <p><strong>Процент доли:</strong> ${data.share_percentage}%</p>
          <p><strong>USDT кошелек:</strong> ${data.usdt_wallet}</p>
          <p><strong>Дата создания:</strong> ${new Date(data.created_at).toLocaleString('ru-RU')}</p>
        </div>
        <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Информация о пользователе:</h3>
          <p><strong>Имя:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Телефон:</strong> ${userPhone}</p>
          <p><strong>ID пользователя:</strong> ${data.user_id}</p>
        </div>
        <p style="margin-top: 30px;">
          <a href="https://kesiglejxnnnxfovfetm.supabase.co/dashboard" 
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Перейти в админ-панель
          </a>
        </p>
      `;
    }

    // Send emails to all admin addresses
    const emailPromises = adminEmails.map(adminEmail => 
      resend.emails.send({
        from: "VINNI <noreply@resend.dev>",
        to: [adminEmail.email],
        subject: subject,
        html: html,
      })
    );

    const emailResults = await Promise.allSettled(emailPromises);
    
    const successCount = emailResults.filter(result => result.status === 'fulfilled').length;
    const failureCount = emailResults.filter(result => result.status === 'rejected').length;

    console.log(`Emails sent: ${successCount} successful, ${failureCount} failed`);

    if (failureCount > 0) {
      console.error('Some emails failed to send:', emailResults.filter(r => r.status === 'rejected'));
    }

    return new Response(JSON.stringify({ 
      message: 'Notifications processed',
      sent: successCount,
      failed: failureCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in notify-admins function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);