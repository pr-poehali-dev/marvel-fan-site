import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import NewsSection from '@/components/NewsSection';
import SecretMaterialsSection from '@/components/SecretMaterialsSection';
import AuthDialogs from '@/components/AuthDialogs';

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

  const handleAuth = async (authForm: { username: string; email: string; password: string }, isLogin: boolean) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Header 
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

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
        <NewsSection news={news} loading={loading} />

        <SecretMaterialsSection 
          secretMaterials={secretMaterials}
          isPremium={user?.is_premium || false}
          onSubscribeClick={() => setShowSubscribe(true)}
        />
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

      <AuthDialogs
        showAuth={showAuth}
        showSubscribe={showSubscribe}
        user={user}
        onCloseAuth={() => setShowAuth(false)}
        onCloseSubscribe={() => setShowSubscribe(false)}
        onAuth={handleAuth}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default Index;
