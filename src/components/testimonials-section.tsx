import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Алина Морозова",
    role: "Независимый артист",
    avatar: "/professional-woman-scientist.png",
    content:
      "За месяц записала альбом из 8 треков. SynapseAI сделал то, на что у меня раньше уходили годы и студия.",
  },
  {
    name: "Денис Краснов",
    role: "Контент-мейкер, 200K подписчиков",
    avatar: "/cybersecurity-expert-man.jpg",
    content:
      "Делаю саундтреки и клипы для своих видео прямо в платформе. Скорость огромная, качество — студийное.",
  },
  {
    name: "Мария Лещенко",
    role: "Автор песен",
    avatar: "/asian-woman-tech-developer.jpg",
    content:
      "Загружаю свои стихи — получаю готовый трек с вокалом за 2 минуты. Это просто магия для авторов.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4 font-sans">Музыканты выбирают нас</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Что говорят артисты, авторы и контент-мейкеры о платформе SynapseAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glow-border slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="p-6">
                <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}