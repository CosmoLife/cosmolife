
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await register(email, password);
      toast({
        title: "Успешно!",
        description: "Регистрация завершена. Добро пожаловать в Cosmo Life!",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при регистрации",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4 bg-neon-gradient bg-clip-text text-transparent neon-text">
                  Начать инвестировать
                </h1>
                <p className="text-white/80">
                  Создайте аккаунт и начните инвестировать в будущее с Cosmo Life
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-white mb-2 block">
                    Пароль
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Ваш пароль"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-white mb-2 block">
                    Подтвердите пароль
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Повторите пароль"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-3 neon-border animate-neon-pulse"
                >
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </form>
              
              <div className="text-center mt-6">
                <p className="text-white/60">
                  Уже есть аккаунт?{' '}
                  <Link to="/login" className="text-cosmo-blue hover:text-cosmo-purple transition-colors">
                    Войти
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
