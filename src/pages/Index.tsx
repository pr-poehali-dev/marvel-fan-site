import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

const Index = () => {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'Стив Роджерс', text: 'Отличная подборка! Жду новые фильмы в 2025!', date: '29.12.2024' },
    { id: 2, author: 'Тони Старк', text: 'Железный Человек навсегда в моём сердце 🔥', date: '28.12.2024' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [activeSection, setActiveSection] = useState('news');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: 'Гость',
        text: newComment,
        date: new Date().toLocaleDateString('ru-RU')
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const heroes = [
    {
      name: 'Железный Человек',
      realName: 'Тони Старк',
      powers: 'Гениальный интеллект, высокотехнологичная броня',
      image: 'https://cdn.poehali.dev/projects/20408bd5-86c4-408f-a88f-6646c3a6d8f0/files/bc9f855a-3263-4686-9fcb-ba67f168f938.jpg'
    },
    {
      name: 'Капитан Америка',
      realName: 'Стив Роджерс',
      powers: 'Суперсила, выносливость, боевые навыки',
      image: 'https://cdn.poehali.dev/projects/20408bd5-86c4-408f-a88f-6646c3a6d8f0/files/22e58ebf-a0a9-4cd6-a90a-6f8d03344b4d.jpg'
    },
    {
      name: 'Тор',
      realName: 'Тор Одинсон',
      powers: 'Бог грома, сверхчеловеческая сила, Мьёльнир',
      image: 'https://cdn.poehali.dev/projects/20408bd5-86c4-408f-a88f-6646c3a6d8f0/files/a7af761c-633d-4414-a3cd-bd3497370f1d.jpg'
    }
  ];

  const movies = [
    { title: 'Мстители: Финал', year: 2019, rating: 9.2, phase: 'Фаза 3' },
    { title: 'Железный Человек', year: 2008, rating: 8.9, phase: 'Фаза 1' },
    { title: 'Война бесконечности', year: 2018, rating: 9.0, phase: 'Фаза 3' },
    { title: 'Человек-паук: Нет пути домой', year: 2021, rating: 8.8, phase: 'Фаза 4' }
  ];

  const news = [
    { title: 'Анонсирован новый фильм про Мстителей', date: '30.12.2024', category: 'Премьеры' },
    { title: 'Раскрыты детали 6-й фазы MCU', date: '29.12.2024', category: 'Новости' },
    { title: 'Интервью с режиссёром «Дэдпул и Росомаха»', date: '28.12.2024', category: 'Интервью' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-primary/20">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-primary animate-scale-in">MARVEL</div>
            <Badge variant="outline" className="text-accent border-accent">FAN SITE</Badge>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="hover:text-primary transition-colors" onClick={() => setActiveSection('news')}>
              <Icon name="Newspaper" size={20} className="mr-2" />
              Новости
            </Button>
            <Button variant="ghost" className="hover:text-primary transition-colors" onClick={() => setActiveSection('heroes')}>
              <Icon name="Users" size={20} className="mr-2" />
              Персонажи
            </Button>
            <Button variant="ghost" className="hover:text-primary transition-colors" onClick={() => setActiveSection('movies')}>
              <Icon name="Film" size={20} className="mr-2" />
              Фильмы
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/20408bd5-86c4-408f-a88f-6646c3a6d8f0/files/a7af761c-633d-4414-a3cd-bd3497370f1d.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="relative z-10 text-center space-y-6 animate-fade-in px-4">
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            ВСЕЛЕННАЯ MARVEL
          </h1>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
            Всё о героях, фильмах и новостях киновселенной Marvel
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/50">
              <Icon name="Zap" size={20} className="mr-2" />
              Последние новости
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Icon name="Users" size={20} className="mr-2" />
              Все персонажи
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16 space-y-16">
        <section id="news" className="animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="Newspaper" size={32} className="text-primary" />
            <h2 className="text-4xl font-bold">Последние новости</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <Card 
                key={index} 
                className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:text-primary">
                    Читать далее
                    <Icon name="ArrowRight" size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="heroes" className="animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="Zap" size={32} className="text-accent" />
            <h2 className="text-4xl font-bold">Популярные персонажи</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {heroes.map((hero, index) => (
              <Card 
                key={index} 
                className="group overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 border-accent/20"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={hero.image} 
                    alt={hero.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">{hero.name}</h3>
                  </div>
                </div>
                <CardHeader>
                  <CardDescription className="text-muted-foreground">
                    <strong>Настоящее имя:</strong> {hero.realName}
                  </CardDescription>
                  <CardDescription className="text-muted-foreground">
                    <strong>Способности:</strong> {hero.powers}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                    Узнать больше
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="movies" className="animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="Film" size={32} className="text-primary" />
            <h2 className="text-4xl font-bold">Фильмы Marvel</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <Card 
                key={index}
                className="hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 border-primary/20"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{movie.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{movie.phase}</Badge>
                    <Badge className="bg-accent text-accent-foreground">{movie.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-2xl font-bold text-accent">
                    <Icon name="Star" size={20} className="fill-accent" />
                    {movie.rating}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="gallery" className="animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="Images" size={32} className="text-accent" />
            <h2 className="text-4xl font-bold">Галерея</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {heroes.map((hero, index) => (
              <div 
                key={index}
                className="relative group overflow-hidden rounded-lg aspect-video hover:scale-105 transition-all duration-500 cursor-pointer"
              >
                <img 
                  src={hero.image} 
                  alt={hero.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xl font-bold text-white">{hero.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="comments" className="animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="MessageCircle" size={32} className="text-primary" />
            <h2 className="text-4xl font-bold">Комментарии фанов</h2>
          </div>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Оставьте свой комментарий</CardTitle>
              <CardDescription>Поделитесь мнением о вселенной Marvel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Напишите комментарий..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] border-primary/20 focus:border-primary"
                />
              </div>
              <Button 
                onClick={handleAddComment}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Icon name="Send" size={16} className="mr-2" />
                Отправить
              </Button>
              
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-semibold">Комментарии ({comments.length})</h3>
                {comments.map((comment) => (
                  <Card key={comment.id} className="border-secondary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon name="User" size={16} className="text-primary" />
                          <span className="font-semibold">{comment.author}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{comment.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{comment.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-secondary/50 border-t border-primary/20 py-12 mt-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="text-3xl font-bold text-primary">MARVEL FAN SITE</div>
          <p className="text-muted-foreground">
            Фан-сайт, посвящённый киновселенной Marvel. Создано фанатами для фанатов.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="icon">
              <Icon name="Twitter" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Facebook" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Instagram" size={20} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Marvel Fan Site. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
