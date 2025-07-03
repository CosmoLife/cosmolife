
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const location = useLocation();

  const handleGoToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToRoadmap = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#roadmap');
    } else {
      document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-white neon-text">COSMO</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" onClick={handleGoToHome} className="text-white hover:text-cosmo-blue transition-colors">Главная</a>
          <a href="#roadmap" onClick={handleGoToRoadmap} className="text-white hover:text-cosmo-blue transition-colors">Дорожная карта</a>
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
                <Button className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green neon-border">
                  Инвестировать
                </Button>
              </Link>
            </div>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-cosmo-blue"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-white/10">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <a href="#" onClick={handleGoToHome} className="block text-white hover:text-cosmo-blue transition-colors py-2">
              Главная
            </a>
            <a href="#roadmap" onClick={handleGoToRoadmap} className="block text-white hover:text-cosmo-blue transition-colors py-2">
              Дорожная карта
            </a>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-cosmo-blue transition-colors py-2">
                  Кабинет
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="w-full border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white"
                >
                  Выйти
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white">
                    Войти
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green">
                    Инвестировать
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
