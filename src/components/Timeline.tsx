import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  chronological_order: number;
  phase_id: number;
  content_type: string;
  image_url: string;
  duration_minutes: number;
  director: string;
  box_office: number;
  rating: number;
  universe: string;
  phase_name: string;
  phase_description?: string;
  characters?: Character[];
  easter_eggs?: EasterEgg[];
}

interface Character {
  id: number;
  name: string;
  real_name: string;
  actor: string;
  role: string;
  image_url?: string;
}

interface Phase {
  id: number;
  name: string;
  description: string;
  start_year: number;
  end_year: number;
}

interface EasterEgg {
  id: number;
  title: string;
  description: string;
  timestamp_minutes: number;
}

interface TimelineProps {
  apiUrl: string;
}

const Timeline = ({ apiUrl }: TimelineProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [showMovieDialog, setShowMovieDialog] = useState(false);

  useEffect(() => {
    loadTimeline();
  }, [selectedPhase, selectedCharacter]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      let url = apiUrl;
      const params = [];
      if (selectedPhase) params.push(`phase_id=${selectedPhase}`);
      if (selectedCharacter) params.push(`character_id=${selectedCharacter}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.movies || []);
      setPhases(data.phases || []);
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMovieDetails = async (movieId: number) => {
    try {
      const response = await fetch(`${apiUrl}?movie_id=${movieId}`);
      const data = await response.json();
      setSelectedMovie(data.movie);
      setShowMovieDialog(true);
    } catch (error) {
      console.error('Error loading movie details:', error);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return 'Film';
      case 'series': return 'Tv';
      case 'special': return 'Sparkles';
      default: return 'Film';
    }
  };

  const resetFilters = () => {
    setSelectedPhase(null);
    setSelectedCharacter(null);
  };

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Icon name="Timeline" size={32} className="text-accent" />
          <h2 className="text-4xl font-bold">Интерактивная хронология</h2>
        </div>
        {(selectedPhase || selectedCharacter) && (
          <Button onClick={resetFilters} variant="outline">
            <Icon name="X" size={16} className="mr-2" />
            Сбросить фильтры
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Filter" size={20} />
              Фильтры
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Фаза MCU:</p>
              <div className="flex flex-wrap gap-2">
                {phases.map((phase) => (
                  <Badge
                    key={phase.id}
                    variant={selectedPhase === phase.id ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      selectedPhase === phase.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-primary/10'
                    }`}
                    onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  >
                    {phase.name} ({phase.start_year}-{phase.end_year})
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Персонаж:</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {characters.slice(0, 10).map((character) => (
                  <Badge
                    key={character.id}
                    variant={selectedCharacter === character.id ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      selectedCharacter === character.id
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/10'
                    }`}
                    onClick={() =>
                      setSelectedCharacter(selectedCharacter === character.id ? null : character.id)
                    }
                  >
                    {character.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-32 bg-muted rounded" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary" />

            <div className="space-y-8">
              {movies.map((movie, index) => (
                <div key={movie.id} className="relative pl-20">
                  <div className="absolute left-5 top-6 w-8 h-8 rounded-full bg-primary border-4 border-background flex items-center justify-center shadow-lg">
                    <Icon name={getContentTypeIcon(movie.content_type)} size={16} className="text-primary-foreground" />
                  </div>

                  <Card
                    className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/30 cursor-pointer border-primary/20"
                    onClick={() => loadMovieDetails(movie.id)}
                  >
                    <div className="flex">
                      <div className="w-1/3 relative overflow-hidden">
                        <img
                          src={movie.image_url || 'https://placehold.co/300x400/1a1f2c/e23636?text=Marvel'}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary/90 backdrop-blur-sm">
                            {movie.phase_name}
                          </Badge>
                        </div>
                      </div>

                      <div className="w-2/3 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {movie.content_type === 'movie' ? 'Фильм' : movie.content_type === 'series' ? 'Сериал' : 'Спецвыпуск'}
                          </Badge>
                          {movie.rating && (
                            <div className="flex items-center gap-1">
                              <Icon name="Star" size={14} className="text-accent fill-accent" />
                              <span className="text-sm font-semibold">{movie.rating}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {movie.description}
                        </p>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={12} />
                            <span>{new Date(movie.release_date).toLocaleDateString('ru-RU')}</span>
                          </div>
                          {movie.director && (
                            <div className="flex items-center gap-2">
                              <Icon name="User" size={12} />
                              <span>{movie.director}</span>
                            </div>
                          )}
                          {movie.duration_minutes && (
                            <div className="flex items-center gap-2">
                              <Icon name="Clock" size={12} />
                              <span>{movie.duration_minutes} мин</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showMovieDialog} onOpenChange={setShowMovieDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedMovie && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedMovie.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="FileText" size={16} />
                    Описание
                  </h4>
                  <p className="text-muted-foreground">{selectedMovie.description}</p>
                </div>

                {selectedMovie.characters && selectedMovie.characters.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Users" size={16} />
                      Персонажи
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedMovie.characters.map((char) => (
                        <Card key={char.id} className="p-3">
                          <div className="space-y-1">
                            <p className="font-semibold text-sm">{char.name}</p>
                            {char.real_name && (
                              <p className="text-xs text-muted-foreground">{char.real_name}</p>
                            )}
                            {char.actor && (
                              <p className="text-xs text-muted-foreground">🎭 {char.actor}</p>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {char.role === 'main' ? 'Главная роль' : char.role === 'supporting' ? 'Второстепенная' : 'Камео'}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMovie.easter_eggs && selectedMovie.easter_eggs.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Sparkles" size={16} className="text-accent" />
                      Пасхалки
                    </h4>
                    <div className="space-y-2">
                      {selectedMovie.easter_eggs.map((egg) => (
                        <Card key={egg.id} className="p-3 border-accent/30">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="text-xs shrink-0">
                              {egg.timestamp_minutes} мин
                            </Badge>
                            <div>
                              <p className="font-semibold text-sm">{egg.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{egg.description}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Timeline;
