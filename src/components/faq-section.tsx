import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Кому принадлежат созданные треки и клипы?",
      answer:
        "Все созданные тобой треки, тексты и клипы принадлежат тебе. Ты можешь использовать их в коммерческих целях, публиковать в соцсетях и стриминговых сервисах.",
    },
    {
      question: "Сколько времени занимает создание трека?",
      answer:
        "Полноценный трек с вокалом и аранжировкой готов за 2-5 минут. Клип под трек создаётся примерно столько же. Длинные композиции могут занять до 10 минут.",
    },
    {
      question: "Можно ли использовать свой текст для песни?",
      answer:
        "Да! Загрузи свои стихи или текст, выбери жанр и стиль вокала — нейросеть создаст полноценный трек именно на твой текст.",
    },
    {
      question: "В каком формате я получу файлы?",
      answer:
        "Треки скачиваются в форматах MP3 и WAV (студийное качество). Клипы — в HD MP4. Все файлы доступны в личном кабинете в любое время.",
    },
    {
      question: "Сколько треков можно создать в месяц?",
      answer:
        "Зависит от тарифа. На бесплатном — 3 трека в месяц для пробы, на Pro — 100 треков, на Studio — без ограничений.",
    },
    {
      question: "Можно ли отменить подписку?",
      answer:
        "Да, подписка отменяется в один клик в личном кабинете. Все созданные ранее треки остаются у тебя навсегда.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Всё, что важно знать о создании музыки и клипов на платформе SynapseAI.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-red-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-red-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}