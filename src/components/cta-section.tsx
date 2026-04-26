import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function CTASection() {
  const navigate = useNavigate()
  return (
    <section className="py-24 px-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="slide-up">
          <h2 className="text-5xl font-bold text-foreground mb-6 font-sans text-balance">Готов записать свой первый хит?</h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Регистрируйся бесплатно и создавай треки, тексты и клипы с помощью ИИ.
            Первые 3 трека — бесплатно, никаких карт не требуется.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 pulse-button text-lg px-8 py-4"
              onClick={() => navigate("/register")}
            >
              Создать первый трек
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4 bg-transparent"
              onClick={() => {
                const el = document.getElementById("pricing")
                el?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Посмотреть тарифы
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}