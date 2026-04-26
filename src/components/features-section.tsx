import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const features = [
  {
    title: "Генерация музыки",
    description: "Создавай треки в любом жанре за минуты — от лоу-фай до электронной танцевальной музыки и рока.",
    icon: "Music",
    badge: "AI Music",
  },
  {
    title: "Треки на твой текст",
    description: "Загрузи свой текст или стихи — нейросеть превратит их в полноценный музыкальный трек с вокалом.",
    icon: "Mic",
    badge: "Vocal AI",
  },
  {
    title: "Генерация текстов",
    description: "Помощник напишет цепляющие тексты песен в нужном стиле, настроении и теме за пару секунд.",
    icon: "PenLine",
    badge: "Lyrics",
  },
  {
    title: "Создание клипов",
    description: "Автоматический видеоряд под твой трек: визуалы, эффекты, синхронизация с битом.",
    icon: "Video",
    badge: "Video AI",
  },
  {
    title: "Облачное хранилище",
    description: "Все твои треки, тексты и клипы хранятся в личном кабинете. Доступ с любого устройства.",
    icon: "Cloud",
    badge: "Cloud",
  },
  {
    title: "Скачивание в HD",
    description: "Экспорт треков в WAV/MP3 и клипов в HD-качестве. Полные права на использование.",
    icon: "Download",
    badge: "HD Export",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Всё для твоей музыки</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Полный набор AI-инструментов для создания треков, текстов и клипов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <Icon name={feature.icon} size={24} className="text-red-500" />
                  </div>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}