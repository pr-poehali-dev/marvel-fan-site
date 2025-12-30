import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'Newspaper',
      title: 'Следить за новостями',
      description: 'Читайте самые свежие анонсы, слухи и премьеры. Каждой новости присваивается рейтинг достоверности',
      color: 'text-primary'
    },
    {
      icon: 'Timeline',
      title: 'Изучать вселенную',
      description: 'Погружайтесь в мир Marvel с помощью интерактивной хронологии и базы знаний о персонажах',
      color: 'text-accent'
    },
    {
      icon: 'Crown',
      title: 'Смотреть эксклюзивы',
      description: 'Получайте доступ к уникальным материалам: удалённым сценам, концепт-артам и интервью',
      color: 'text-primary'
    },
    {
      icon: 'MessageCircle',
      title: 'Оценивать и обсуждать',
      description: 'Ставьте оценки новостям на основе их достоверности и участвуйте в обсуждениях с фанатами',
      color: 'text-accent'
    }
  ];

  return (
    <section className="animate-scale-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Что можно сделать на сайте</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Исследуйте вселенную Marvel, будьте в курсе последних событий и общайтесь с единомышленниками
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 border-primary/20"
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 w-fit group-hover:scale-110 transition-transform">
                <Icon name={feature.icon as any} size={32} className={feature.color} />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12 border-accent/50 bg-gradient-to-r from-accent/5 to-primary/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-accent/20">
              <Icon name="Lightbulb" size={40} className="text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl">Скоро на сайте</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <Icon name="User" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold">Персональная лента</h3>
              <p className="text-sm text-muted-foreground">
                Отметьте любимых персонажей — новости о них появятся в вашей ленте первыми
              </p>
            </div>
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <Icon name="MessageSquare" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold">Доска теорий</h3>
              <p className="text-sm text-muted-foreground">
                Публикуйте свои теории о будущем MCU и голосуйте за самые правдоподобные
              </p>
            </div>
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <Icon name="TrendingUp" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold">Рейтинг фильмов</h3>
              <p className="text-sm text-muted-foreground">
                Оценивайте фильмы и сериалы, смотрите общественный рейтинг и топ проектов
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FeaturesSection;
