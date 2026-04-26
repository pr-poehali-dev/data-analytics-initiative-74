import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { useNavigate } from "react-router-dom"

const plans = [
  {
    name: "Free",
    price: "0",
    period: "навсегда",
    description: "Чтобы попробовать платформу",
    features: [
      "3 трека в месяц",
      "5 текстов в месяц",
      "1 клип в месяц",
      "Качество MP3",
      "Хранилище 500 МБ",
    ],
    cta: "Начать бесплатно",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "990",
    period: "в месяц",
    description: "Для активных авторов",
    features: [
      "100 треков в месяц",
      "Безлимит текстов",
      "30 клипов в месяц",
      "Качество WAV студийное",
      "Хранилище 50 ГБ",
      "Коммерческое использование",
    ],
    cta: "Оформить Pro",
    highlighted: true,
  },
  {
    name: "Studio",
    price: "2 490",
    period: "в месяц",
    description: "Для профессионалов",
    features: [
      "Безлимит треков",
      "Безлимит текстов и клипов",
      "Качество WAV/HD",
      "Хранилище 500 ГБ",
      "Приоритет в очереди",
      "Эксклюзивные стили",
      "Поддержка 24/7",
    ],
    cta: "Оформить Studio",
    highlighted: false,
  },
]

export function PricingSection() {
  const navigate = useNavigate()
  return (
    <section id="pricing" className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
            Тарифы и подписка
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Выбери план под свои задачи. Можно начать бесплатно и обновиться в любой момент.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-8 bg-zinc-900/60 backdrop-blur transition-all duration-300 ${
                plan.highlighted
                  ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)] scale-105"
                  : "border-red-500/20 hover:border-red-500/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full font-orbitron">
                  ПОПУЛЯРНЫЙ
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">₽ / {plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <Icon name="Check" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/register")}
                className={`w-full ${
                  plan.highlighted
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-white/5 border border-red-500/30 text-white hover:bg-red-500/10"
                } font-geist`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
