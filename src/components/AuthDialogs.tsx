import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface User {
  user_id: number;
  username: string;
  is_premium: boolean;
  premium_until: string | null;
  token: string;
}

interface AuthDialogsProps {
  showAuth: boolean;
  showSubscribe: boolean;
  user: User | null;
  onCloseAuth: () => void;
  onCloseSubscribe: () => void;
  onAuth: (authForm: { username: string; email: string; password: string }, isLogin: boolean) => void;
  onSubscribe: () => void;
}

const AuthDialogs = ({ 
  showAuth, 
  showSubscribe, 
  user,
  onCloseAuth, 
  onCloseSubscribe, 
  onAuth, 
  onSubscribe 
}: AuthDialogsProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleAuth = () => {
    onAuth(authForm, isLogin);
  };

  return (
    <>
      <Dialog open={showAuth} onOpenChange={onCloseAuth}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isLogin ? 'Вход в систему' : 'Регистрация'}</DialogTitle>
            <DialogDescription>
              {isLogin ? 'Войдите чтобы получить доступ к премиум-контенту' : 'Создайте аккаунт для доступа к эксклюзивным материалам'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input 
                  id="username"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                  placeholder="Введите имя"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input 
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>

            <Button onClick={handleAuth} className="w-full bg-primary hover:bg-primary/90">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => setIsLogin(!isLogin)}
              className="w-full"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubscribe} onOpenChange={onCloseSubscribe}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оформить Premium подписку</DialogTitle>
            <DialogDescription>
              Получите доступ ко всем секретным материалам Marvel
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">299₽</div>
              <div className="text-muted-foreground">в месяц</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Icon name="Check" size={20} className="text-accent" />
                <span>Доступ к секретным материалам</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Check" size={20} className="text-accent" />
                <span>Эксклюзивные интервью</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Check" size={20} className="text-accent" />
                <span>Удалённые сцены из фильмов</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Check" size={20} className="text-accent" />
                <span>Концепт-арты и дизайны</span>
              </div>
            </div>

            <Button 
              onClick={onSubscribe} 
              className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold text-lg"
              disabled={!user}
            >
              <Icon name="Crown" size={20} className="mr-2" />
              {user ? 'Оформить подписку' : 'Сначала войдите в систему'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthDialogs;
