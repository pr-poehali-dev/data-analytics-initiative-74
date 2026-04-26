import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"

const plans = [
  {
    id: "Free",
    name: "Free",
    price: "0",
    features: ["3 трека / мес", "5 текстов / мес", "1 клип / мес", "MP3 качество", "500 МБ"],
  },
  {
    id: "Pro",
    name: "Pro",
    price: "990",
    features: ["100 треков / мес", "Безлимит текстов", "30 клипов / мес", "WAV студийный", "50 ГБ", "Коммерческое использование"],
    popular: true,
  },
  {
    id: "Studio",
    name: "Studio",
    price: "2 490",
    features: ["Безлимит треков", "Безлимит клипов", "WAV/HD", "500 ГБ", "Приоритет очереди", "Поддержка 24/7"],
  },
]

export default function Billing() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("synapse_user")
    if (!raw) {
      navigate("/login")
      return
    }
    setUser(JSON.parse(raw))
  }, [navigate])

  const handleSubscribe = (planId: string) => {
    if (!user) return
    if (planId === user.plan) {
      toast.info("Этот тариф уже активен")
      return
    }
    setProcessing(planId)
    setTimeout(() => {
      const updated = { ...user, plan: planId }
      localStorage.setItem("synapse_user", JSON.stringify(updated))
      setUser(updated)
      setProcessing(null)
      toast.success(`Тариф ${planId} активирован!`)
    }, 1200)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black dark">
      <nav className="border-b border-red-500/20 bg-black/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-400 hover:text-red-500">
              <Icon name="ArrowLeft" size={20} />
            </Link>
            <span className="font-orbitron text-xl font-bold text-white">
              Synapse<span className="text-red-500">AI</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-orbitron">Подписка и оплата</h1>
        <p className="text-gray-400 mb-2">Текущий тариф: <span className="text-red-400 font-semibold">{user.plan}</span></p>
        <p className="text-gray-500 mb-10 text-sm">Меняй тариф в любой момент. Отмена — в один клик.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === user.plan
            return (
              <Card
                key={plan.id}
                className={`relative p-6 bg-zinc-900/60 transition-all ${
                  plan.popular ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : "border-red-500/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full font-orbitron">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1 font-orbitron">{plan.name}</h3>
                <div className="mb-5">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">₽/мес</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-gray-300 text-sm">
                      <Icon name="Check" size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || processing !== null}
                  className={`w-full ${
                    isCurrent
                      ? "bg-white/10 text-gray-400 cursor-not-allowed"
                      : plan.popular
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-white/5 border border-red-500/30 text-white hover:bg-red-500/10"
                  }`}
                >
                  {processing === plan.id
                    ? "Оплата..."
                    : isCurrent
                    ? "Активный тариф"
                    : "Оформить"}
                </Button>
              </Card>
            )
          })}
        </div>

        <Card className="mt-10 p-6 bg-zinc-900/60 border-red-500/20">
          <h3 className="text-lg font-bold text-white mb-3 font-orbitron">Способы оплаты</h3>
          <p className="text-gray-400 text-sm mb-4">
            Принимаем карты Visa, Mastercard, МИР, СБП и ЮMoney. Оплата защищена шифрованием.
          </p>
          <div className="flex flex-wrap gap-3">
            {["CreditCard", "Smartphone", "Wallet"].map((icon) => (
              <div key={icon} className="px-4 py-2 rounded-lg bg-black/40 border border-red-500/10 flex items-center gap-2 text-gray-300 text-sm">
                <Icon name={icon} size={18} className="text-red-500" />
                {icon === "CreditCard" ? "Карта" : icon === "Smartphone" ? "СБП" : "ЮMoney"}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
