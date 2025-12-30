import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface News {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
  credibility_rating: number;
  source: string;
  is_premium: boolean;
  views_count: number;
  published_at: string;
}

interface SecretMaterial {
  id: number;
  title: string;
  content: string;
  material_type: string;
  image_url: string;
}

interface User {
  user_id: number;
  username: string;
  is_premium: boolean;
  premium_until: string | null;
  token: string;
}

const Index = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [secretMaterials, setSecretMaterials] = useState<SecretMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('marvel_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    loadNews();
  }, []);

  useEffect(() => {
    if (user?.is_premium) {
      loadSecretMaterials();
    }
  }, [user]);

  const loadNews = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/89ae2e41-3684-4389-9d75-0cf7debf5c64');
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSecretMaterials = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('https://functions.poehali.dev/a5b6aeea-275e-4e3d-a3b9-89cd6129e01a', {
        headers: {
          'X-User-Id': user.user_id.toString()
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSecretMaterials(data.materials || []);
      }
    } catch (error) {
      console.error('Error loading secret materials:', error);
    }
  };

  const handleAuth = async () => {
    const action = isLogin ? 'login' : 'register';
    
    try {
      const body = isLogin 
        ? { action, email: authForm.email, password: authForm.password }
        : { action, username: authForm.username, email: authForm.email, password: authForm.password };

      const response = await fetch('https://functions.poehali.dev/88d11271-0c7b-45c0-b66f-d81ed770974b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = {
          user_id: data.user_id,
          username: data.username,
          is_premium: data.is_premium || false,
          premium_until: data.premium_until || null,
          token: data.token
        };
        setUser(userData);
        localStorage.setItem('marvel_user', JSON.stringify(userData));
        setShowAuth(false);
        toast({
          title: isLogin ? 'Добро пожаловать!' : 'Регистрация успешна!',
          description: `Привет, ${data.username}!`
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Что-то пошло не так',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить запрос',
        variant: 'destructive'
      });
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему для оформления подписки',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/5773e493-d239-4243-a2cc-b8b412b7364b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedUser = { ...user, is_premium: true, premium_until: data.premium_until };
        setUser(updatedUser);
        localStorage.setItem('marvel_user', JSON.stringify(updatedUser));
        setShowSubscribe(false);
        toast({
          title: 'Подписка оформлена! 🎉',
          description: 'Теперь у вас есть доступ к эксклюзивным материалам!'
        });
        loadSecretMaterials();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось оформить подписку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить запрос',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('marvel_user');
    setSecretMaterials([]);
    toast({
      title: 'Выход выполнен',
      description: 'До скорых встреч!'
    });
  };

  const renderCredibilityRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i} 
            name="Star" 
            size={14} 
            className={i < rating ? 'fill-accent text-accent' : 'text-muted'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
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
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выход
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowAuth(true)} className="bg-primary hover:bg-primary/90">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
            )}
          </div>
        </nav>
      </header>

      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/20408bd5-86c4-408f-a88f-6646c3a6d8f0/files/a7af761c-633d-4414-a3cd-bd3497370f1d.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 text-center space-y-6 animate-fade-in px-4">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-slide-up">
            ВСЕЛЕННАЯ MARVEL
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Актуальные новости с рейтингом достоверности и эксклюзивные материалы
          </p>
          {!user?.is_premium && (
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold shadow-2xl shadow-accent/50 animate-scale-in"
              onClick={() => setShowSubscribe(true)}
            >
              <Icon name="Crown" size={20} className="mr-2" />
              Получить Premium за 299₽
            </Button>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-16 space-y-16">
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Icon name="Newspaper" size={32} className="text-primary" />
              <h2 className="text-4xl font-bold">Актуальные новости</h2>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Icon name="TrendingUp" size={14} className="mr-1" />
              С рейтингом достоверности
            </Badge>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-20 bg-muted rounded" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.filter(n => !n.is_premium).map((item) => (
                <Card 
                  key={item.id} 
                  className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer border-primary/20 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Достоверность:</span>
                        {renderCredibilityRating(item.credibility_rating)}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.content}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.source}</span>
                      <div className="flex items-center gap-1">
                        <Icon name="Eye" size={12} />
                        {item.views_count}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {user?.is_premium && secretMaterials.length > 0 && (
          <section className="animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl border-2 border-accent p-8 bg-gradient-to-br from-accent/10 to-primary/10">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-accent to-primary text-white shadow-lg">
                  <Icon name="Lock" size={14} className="mr-1" />
                  PREMIUM ONLY
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <Icon name="ShieldCheck" size={32} className="text-accent" />
                <h2 className="text-4xl font-bold">Секретные материалы</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {secretMaterials.map((material) => (
                  <Card 
                    key={material.id} 
                    className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/30 border-accent/30"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={material.image_url} 
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-accent-foreground">
                          {material.material_type}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-accent transition-colors">
                        {material.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {material.content}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                        <Icon name="Download" size={16} className="mr-2" />
                        Открыть
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {!user?.is_premium && (
          <section className="animate-scale-in">
            <Card className="border-accent/50 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardHeader className="text-center space-y-4 py-12">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-accent/20">
                    <Icon name="Crown" size={48} className="text-accent" />
                  </div>
                </div>
                <CardTitle className="text-4xl">Откройте мир эксклюзива</CardTitle>
                <CardDescription className="text-lg max-w-2xl mx-auto">
                  Получите доступ к секретным материалам, удалённым сценам, концепт-артам и эксклюзивным интервью
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-12">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <Icon name="FileVideo" size={32} className="mx-auto text-primary" />
                    <h3 className="font-semibold">Удалённые сцены</h3>
                    <p className="text-sm text-muted-foreground">Эксклюзивные кадры из фильмов</p>
                  </div>
                  <div className="space-y-2">
                    <Icon name="Palette" size={32} className="mx-auto text-primary" />
                    <h3 className="font-semibold">Концепт-арты</h3>
                    <p className="text-sm text-muted-foreground">Оригинальные дизайны персонажей</p>
                  </div>
                  <div className="space-y-2">
                    <Icon name="Mic" size={32} className="mx-auto text-primary" />
                    <h3 className="font-semibold">Интервью</h3>
                    <p className="text-sm text-muted-foreground">С режиссёрами и актёрами</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold text-lg px-12"
                  onClick={() => setShowSubscribe(true)}
                >
                  <Icon name="Zap" size={20} className="mr-2" />
                  Подписаться за 299₽ / месяц
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <footer className="bg-secondary/50 border-t border-primary/20 py-12 mt-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="text-3xl font-bold text-primary">MARVEL FAN SITE</div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Фан-сайт с проверенными новостями, рейтингом достоверности и эксклюзивным контентом для настоящих фанатов Marvel
          </p>
          <p className="text-sm text-muted-foreground">© 2024 Marvel Fan Site. Все права защищены.</p>
        </div>
      </footer>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
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

      <Dialog open={showSubscribe} onOpenChange={setShowSubscribe}>
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
              onClick={handleSubscribe} 
              className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold text-lg"
              disabled={!user}
            >
              <Icon name="Crown" size={20} className="mr-2" />
              {user ? 'Оформить подписку' : 'Сначала войдите в систему'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
