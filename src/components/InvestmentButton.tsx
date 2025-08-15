import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const InvestmentButton = () => {
  let user = null;
  
  try {
    const authData = useAuth();
    user = authData.user;
  } catch (error) {
    // useAuth not available on this page, that's ok
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      {user ? (
        // Если пользователь авторизован, ведем в личный кабинет
        <Link to="/dashboard">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 text-lg"
          >
            Инвестировать сейчас
          </Button>
        </Link>
      ) : (
        // Если не авторизован, ведем на регистрацию
        <Link to="/register">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 text-lg"
          >
            Инвестировать сейчас
          </Button>
        </Link>
      )}
      
      <a 
        href="#about" 
        className="inline-block"
      >
        <Button 
          variant="outline" 
          size="lg"
          className="border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white py-4 px-8 text-lg"
        >
          Узнать больше
        </Button>
      </a>
    </div>
  );
};

export default InvestmentButton;