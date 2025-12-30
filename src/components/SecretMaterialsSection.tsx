import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SecretMaterial {
  id: number;
  title: string;
  content: string;
  material_type: string;
  image_url: string;
}

interface SecretMaterialsSectionProps {
  secretMaterials: SecretMaterial[];
  isPremium: boolean;
  onSubscribeClick: () => void;
}

const SecretMaterialsSection = ({ secretMaterials, isPremium, onSubscribeClick }: SecretMaterialsSectionProps) => {
  if (isPremium && secretMaterials.length > 0) {
    return (
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
    );
  }

  if (!isPremium) {
    return (
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
              onClick={onSubscribeClick}
            >
              <Icon name="Zap" size={20} className="mr-2" />
              Подписаться за 299₽ / месяц
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return null;
};

export default SecretMaterialsSection;
