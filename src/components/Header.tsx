
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  let user = null;
  let logout = () => {};
  
  try {
    const authData = useAuth();
    user = authData.user;
    logout = authData.logout;
  } catch (error) {
    // useAuth not available on this page, that's ok
  }
  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-white neon-text">COSMO</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-white hover:text-cosmo-blue transition-colors">Главная</a>
          <a href="#roadmap" className="text-white hover:text-cosmo-blue transition-colors">Дорожная карта</a>
          {user ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-cosmo-blue transition-colors">Кабинет</Link>
              <Button variant="outline" onClick={handleLogout} className="border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white">
                Выйти
              </Button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white">
                  Войти
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green neon-border animate-neon-pulse">
                  Инвестировать
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
