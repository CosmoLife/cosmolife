
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkEmailExists = async (email: string) => {
    try {
      // Проверяем существует ли пользователь с таким email
      const { data } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password' // Используем фальшивый пароль для проверки
      });
      
      return false; // Если дошли сюда, значит email не существует
    } catch (error: any) {
      // Если получили ошибку "Invalid login credentials", значит email не существует
      if (error.message === 'Invalid login credentials') {
        return false;
      }
      // Если получили другую ошибку, возможно email существует
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите ваше ФИО",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Проверяем, существует ли уже пользователь с таким email
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        toast({
          title: "Ошибка",
          description: "Пользователь с таким email уже зарегистрирован",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      await register(email, password, fullName);
      toast({
        title: "Регистрация успешна!",
        description: "Добро пожаловать в Cosmo Life. Проверьте email для подтверждения аккаунта.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      let errorMessage = "Произошла ошибка при регистрации";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Пользователь с таким email уже зарегистрирован";
      } else if (error.message?.includes('Password')) {
        errorMessage = "Пароль должен содержать минимум 6 символов";
      } else if (error.message?.includes('Email')) {
        errorMessage = "Введите корректный email адрес";
      }
      
      toast({
        title: "Ошибка регистрации",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 neon-border">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4 bg-neon-gradient bg-clip-text text-transparent neon-text">
                  Регистрация инвестора
                </h1>
                <p className="text-white/80">
                  Создайте аккаунт для инвестирования в Cosmo Life
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-white mb-2 block">
                    ФИО *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Иванов Иван Иванович"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-white mb-2 block">
                    Пароль *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Минимум 6 символов"
                    required
                    minLength={6}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 neon-border animate-neon-pulse"
                >
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </form>
              
              <div className="text-center mt-6">
                <span className="text-white/60">Уже есть аккаунт? </span>
                <Link to="/login" className="text-cosmo-blue hover:text-cosmo-purple font-bold">
                  Войти
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
