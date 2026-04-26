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

const API = {
  lyrics: "https://functions.poehali.dev/5ebed163-0236-4168-8160-730f4a4d9650",
  track: "https://functions.poehali.dev/e5511875-bba0-42b0-adf9-0e64d57d1ef7",
  clip: "https://functions.poehali.dev/192bdf48-ac28-4638-942f-cc00f8e9f761",
}

type Mode = "track" | "lyrics" | "clip"
type ClipScene = { time: string; description: string; visual: string }

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
  const [trackUrl, setTrackUrl] = useState<string | null>(null)
  const [trackTaskId, setTrackTaskId] = useState<string | null>(null)
  const [trackStatus, setTrackStatus] = useState<string>("")
  const [clipScenes, setClipScenes] = useState<ClipScene[] | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("synapse_user")
    if (!raw) {
      navigate("/login")
      return
    }
    setUser(JSON.parse(raw))
  }, [navigate])

  const pollTrack = async (taskId: string) => {
    const start = Date.now()
    const TIMEOUT = 5 * 60 * 1000
    while (Date.now() - start < TIMEOUT) {
      try {
        const r = await fetch(`${API.track}?task_id=${encodeURIComponent(taskId)}`)
        const data = await r.json()
        const items = data?.data?.response?.sunoData || data?.data?.data || []
        const first = Array.isArray(items) ? items[0] : null
        const url = first?.audioUrl || first?.audio_url || first?.streamAudioUrl
        const status = data?.data?.status || data?.status
        setTrackStatus(status || "обработка...")
        if (url) {
          setTrackUrl(url)
          setGenerating(false)
          setResult("ready")
          toast.success("Трек готов! Можно слушать и скачивать")
          return
        }
        if (status === "FAILED" || status === "ERROR") {
          setGenerating(false)
          toast.error("Ошибка генерации. Попробуй ещё раз")
          return
        }
      } catch {
        // продолжаем опрос
      }
      await new Promise((res) => setTimeout(res, 6000))
    }
    setGenerating(false)
    toast.error("Время ожидания вышло. Проверь позже в кабинете")
  }

  const handleGenerate = async () => {
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
    setTrackUrl(null)
    setClipScenes(null)
    setTrackStatus("")

    try {
      if (mode === "lyrics") {
        const r = await fetch(API.lyrics, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme, genre, mood }),
        })
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || "Ошибка генерации")
        setResult(data.lyrics)
        toast.success("Текст готов!")
        setGenerating(false)
      } else if (mode === "clip") {
        const r = await fetch(API.clip, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, mood, idea: theme }),
        })
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || "Ошибка генерации")
        setClipScenes(data.scenario?.scenes || [])
        setResult("ready")
        toast.success("Сценарий клипа готов!")
        setGenerating(false)
      } else {
        const r = await fetch(API.track, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, lyrics, genre, mood }),
        })
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || "Ошибка запуска генерации")
        const taskId = data?.data?.taskId || data?.taskId || data?.data?.task_id
        if (!taskId) throw new Error("Не удалось получить task_id")
        setTrackTaskId(taskId)
        setTrackStatus("Генерируем трек, это занимает 1-3 минуты...")
        toast.success("Запустили генерацию! Подожди 1-3 минуты")
        pollTrack(taskId)
      }
    } catch (e: unknown) {
      setGenerating(false)
      const msg = e instanceof Error ? e.message : "Что-то пошло не так"
      toast.error(msg)
    }
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

        {generating && mode === "track" && trackTaskId && (
          <Card className="p-6 bg-zinc-900/60 border-red-500/30 mb-6">
            <div className="flex items-center gap-3">
              <Icon name="Loader" size={20} className="text-red-500 animate-spin" />
              <div>
                <div className="text-white font-medium">{trackStatus || "Обработка..."}</div>
                <div className="text-gray-500 text-xs">Не закрывай страницу — мы покажем готовый трек</div>
              </div>
            </div>
          </Card>
        )}

        {result && (
          <Card className="p-6 bg-zinc-900/60 border-red-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Check" size={20} className="text-red-500" />
              <h3 className="text-lg font-bold text-white font-orbitron">Готово!</h3>
            </div>

            {mode === "lyrics" && (
              <pre className="whitespace-pre-wrap text-gray-200 bg-black/40 p-4 rounded-lg border border-red-500/10 mb-4 font-mono text-sm">
                {result}
              </pre>
            )}

            {mode === "track" && trackUrl && (
              <div className="bg-black/40 p-6 rounded-lg border border-red-500/10 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Icon name="Music" size={32} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{title}</div>
                    <div className="text-gray-500 text-sm">{genre} • {mood}</div>
                  </div>
                </div>
                <audio controls src={trackUrl} className="w-full" />
              </div>
            )}

            {mode === "clip" && clipScenes && (
              <div className="space-y-3 mb-4">
                {clipScenes.map((scene, i) => (
                  <div key={i} className="bg-black/40 p-4 rounded-lg border border-red-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500 text-xs font-mono">{scene.time}</span>
                      <span className="text-white font-medium text-sm">Сцена {i + 1}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{scene.description}</p>
                    <p className="text-gray-500 text-xs italic">Визуал: {scene.visual}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {mode === "track" && trackUrl && (
                <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
                  <a href={trackUrl} download={`${title}.mp3`} target="_blank" rel="noreferrer">
                    <Icon name="Download" size={18} className="mr-2" />
                    Скачать MP3
                  </a>
                </Button>
              )}
              {mode === "lyrics" && (
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(result)
                    toast.success("Текст скопирован")
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Icon name="Copy" size={18} className="mr-2" />
                  Скопировать текст
                </Button>
              )}
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
                onClick={() => { setResult(null); setTrackUrl(null); setClipScenes(null); setTitle(""); setLyrics(""); setTheme("") }}
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