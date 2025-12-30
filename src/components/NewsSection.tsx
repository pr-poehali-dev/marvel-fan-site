import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface NewsSectionProps {
  news: News[];
  loading: boolean;
}

const NewsSection = ({ news, loading }: NewsSectionProps) => {
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
  );
};

export default NewsSection;
