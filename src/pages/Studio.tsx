import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"

type Mode = "track" | "lyrics" | "clip"

export default function Studio() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null)
  const [mode, setMode] = useState<Mode>("track")
  const [title, setTitle] = useState("")
  const [lyrics, setLyrics] = useState("")
  const [genre, setGenre] = useState("pop")
  const [mood, setMood] = useState("energetic")
  const [theme, setTheme] = useState("")
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("synapse_user")
    if (!raw) {
      navigate("/login")
      return
    }
    setUser(JSON.parse(raw))
  }, [navigate])

  const handleGenerate = () => {
    if (mode === "track" && (!title || !lyrics)) {
      toast.error("Заполни название и текст трека")
      return
    }
    if (mode === "lyrics" && !theme) {
      toast.error("Опиши тему текста")
      return
    }
    if (mode === "clip" && !title) {
      toast.error("Выбери трек или укажи название")
      return
    }
    setGenerating(true)
    setResult(null)
    setTimeout(() => {
      setGenerating(false)
      if (mode === "lyrics") {
        setResult(
          `[Куплет 1]\nГород спит, а я не сплю,\nТихо мысли свои ловлю.\nВетер в окна шепчет ритм —\nЭтот вечер будет хитом.\n\n[Припев]\nМы летим, мы горим,\nМы про${theme ? " " + theme : ""} говорим.\nЭта ночь — наша сцена,\nКаждый звук — это перемена.`
        )
      } else {
        setResult("ready")
      }
      toast.success("Готово! Файл сохранён в твой кабинет")
    }, 2200)
  }

  if (!user) return null

  const tabs: { id: Mode; label: string; icon: string }[] = [
    { id: "track", label: "Трек", icon: "Music" },
    { id: "lyrics", label: "Текст", icon: "PenLine" },
    { id: "clip", label: "Клип", icon: "Video" },
  ]

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

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-orbitron">Студия</h1>
        <p className="text-gray-400 mb-8">Выбери, что хочешь создать сегодня</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setMode(t.id); setResult(null) }}
              className={`p-5 rounded-xl border transition text-left ${
                mode === t.id
                  ? "bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  : "bg-zinc-900/50 border-red-500/10 hover:border-red-500/30"
              }`}
            >
              <Icon name={t.icon} size={24} className={mode === t.id ? "text-red-500 mb-2" : "text-gray-400 mb-2"} />
              <div className="text-white font-semibold">{t.label}</div>
            </button>
          ))}
        </div>

        <Card className="p-6 bg-zinc-900/60 border-red-500/20 mb-6">
          {mode === "track" && (
            <div className="space-y-5">
              <div>
                <Label className="text-white mb-2 block">Название трека</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Ночной город"
                  className="bg-black/40 border-red-500/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Твой текст</Label>
                <Textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Вставь свой текст или используй вкладку «Текст», чтобы сгенерировать его..."
                  rows={8}
                  className="bg-black/40 border-red-500/20 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Жанр</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger className="bg-black/40 border-red-500/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pop">Поп</SelectItem>
                      <SelectItem value="rock">Рок</SelectItem>
                      <SelectItem value="hiphop">Хип-хоп</SelectItem>
                      <SelectItem value="electronic">Электронная</SelectItem>
                      <SelectItem value="lofi">Lo-Fi</SelectItem>
                      <SelectItem value="rnb">R&B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white mb-2 block">Настроение</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger className="bg-black/40 border-red-500/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energetic">Энергичное</SelectItem>
                      <SelectItem value="chill">Спокойное</SelectItem>
                      <SelectItem value="sad">Грустное</SelectItem>
                      <SelectItem value="romantic">Романтичное</SelectItem>
                      <SelectItem value="epic">Эпичное</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {mode === "lyrics" && (
            <div className="space-y-5">
              <div>
                <Label className="text-white mb-2 block">О чём песня</Label>
                <Textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Опиши тему: о любви, дружбе, городе, путешествии..."
                  rows={5}
                  className="bg-black/40 border-red-500/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Жанр / стиль</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="bg-black/40 border-red-500/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pop">Поп</SelectItem>
                    <SelectItem value="rock">Рок</SelectItem>
                    <SelectItem value="hiphop">Хип-хоп</SelectItem>
                    <SelectItem value="rap">Рэп</SelectItem>
                    <SelectItem value="ballad">Баллада</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {mode === "clip" && (
            <div className="space-y-5">
              <div>
                <Label className="text-white mb-2 block">Название клипа / трек</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Название трека для клипа"
                  className="bg-black/40 border-red-500/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Стиль визуала</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="bg-black/40 border-red-500/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energetic">Динамичный неон</SelectItem>
                    <SelectItem value="chill">Атмосферный</SelectItem>
                    <SelectItem value="cyberpunk">Киберпанк</SelectItem>
                    <SelectItem value="nature">Природа</SelectItem>
                    <SelectItem value="abstract">Абстракция</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white mb-2 block">Идея ролика</Label>
                <Textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Опиши, что ты хочешь увидеть в клипе..."
                  rows={4}
                  className="bg-black/40 border-red-500/20 text-white"
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white text-lg py-6"
          >
            {generating ? (
              <>
                <Icon name="Loader" size={20} className="mr-2 animate-spin" />
                Создаём магию...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={20} className="mr-2" />
                Сгенерировать
              </>
            )}
          </Button>
        </Card>

        {result && (
          <Card className="p-6 bg-zinc-900/60 border-red-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Check" size={20} className="text-red-500" />
              <h3 className="text-lg font-bold text-white font-orbitron">Готово!</h3>
            </div>

            {mode === "lyrics" ? (
              <pre className="whitespace-pre-wrap text-gray-200 bg-black/40 p-4 rounded-lg border border-red-500/10 mb-4 font-mono text-sm">
                {result}
              </pre>
            ) : (
              <div className="bg-black/40 p-6 rounded-lg border border-red-500/10 mb-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Icon name={mode === "track" ? "Music" : "Video"} size={32} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{title || "Без названия"}</div>
                  <div className="text-gray-500 text-sm">
                    {mode === "track" ? "Трек • 2:48 • WAV" : "Клип • HD MP4"}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => toast.success("Скачивание началось!")}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Icon name="Download" size={18} className="mr-2" />
                Скачать
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-red-500/30 text-white hover:bg-red-500/10"
              >
                <Icon name="FolderOpen" size={18} className="mr-2" />
                В моих файлах
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setResult(null); setTitle(""); setLyrics(""); setTheme("") }}
                className="text-gray-400 hover:text-white"
              >
                Создать ещё
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
