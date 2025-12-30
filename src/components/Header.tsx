import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  user_id: number;
  username: string;
  is_premium: boolean;
  premium_until: string | null;
  token: string;
}

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header = ({ user, onLoginClick, onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/90 border-b border-primary/20 shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-primary animate-scale-in">MARVEL</div>
          <Badge variant="outline" className="text-accent border-accent font-semibold">FAN SITE</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Badge variant={user.is_premium ? 'default' : 'secondary'} className={user.is_premium ? 'bg-accent text-accent-foreground' : ''}>
                  <Icon name="User" size={14} className="mr-1" />
                  {user.username}
                </Badge>
                {user.is_premium && (
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white">
                    <Icon name="Crown" size={14} className="mr-1" />
                    PREMIUM
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выход
              </Button>
            </>
          ) : (
            <Button onClick={onLoginClick} className="bg-primary hover:bg-primary/90">
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
