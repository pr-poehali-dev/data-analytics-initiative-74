import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"

type FileItem = {
  id: string
  type: "track" | "lyrics" | "clip"
  title: string
  createdAt: string
  duration?: string
  url?: string
}

const mockFiles: FileItem[] = [
  { id: "1", type: "track", title: "Ночной город — Synth Pop", createdAt: "20 апр", duration: "2:48" },
  { id: "2", type: "lyrics", title: "Текст: Полёт над облаками", createdAt: "18 апр" },
  { id: "3", type: "clip", title: "Клип к треку «Ночной город»", createdAt: "18 апр", duration: "2:48" },
  { id: "4", type: "track", title: "Lo-Fi Coffee Mood", createdAt: "12 апр", duration: "3:15" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null)
  const [tab, setTab] = useState<"all" | "track" | "lyrics" | "clip">("all")

  useEffect(() => {
    const raw = localStorage.getItem("synapse_user")
    if (!raw) {
      navigate("/login")
      return
    }
    setUser(JSON.parse(raw))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("synapse_user")
    navigate("/")
  }

  const filtered = tab === "all" ? mockFiles : mockFiles.filter((f) => f.type === tab)

  const handleDownload = (item: FileItem) => {
    toast.success(`«${item.title}» начало скачиваться`)
  }

  const typeLabels = {
    track: { label: "Трек", icon: "Music", color: "text-red-400 bg-red-500/10" },
    lyrics: { label: "Текст", icon: "PenLine", color: "text-blue-400 bg-blue-500/10" },
    clip: { label: "Клип", icon: "Video", color: "text-purple-400 bg-purple-500/10" },
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black dark">
      <nav className="border-b border-red-500/20 bg-black/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-orbitron text-xl font-bold text-white">
            Synapse<span className="text-red-500">AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="bg-red-500/10 text-red-400 border-red-500/30">{user.plan}</Badge>
            <span className="text-gray-300 text-sm hidden sm:block">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
              <Icon name="LogOut" size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-orbitron">
              Привет, {user.name}!
            </h1>
            <p className="text-gray-400">Твоя творческая студия — создавай, храни и скачивай.</p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate("/studio")}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Создать новое
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card className="p-5 bg-zinc-900/60 border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Music" size={20} className="text-red-500" />
              <span className="text-gray-400 text-sm">Треки</span>
            </div>
            <div className="text-3xl font-bold text-white">2 / 3</div>
            <p className="text-xs text-gray-500 mt-1">в этом месяце</p>
          </Card>
          <Card className="p-5 bg-zinc-900/60 border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="PenLine" size={20} className="text-blue-400" />
              <span className="text-gray-400 text-sm">Тексты</span>
            </div>
            <div className="text-3xl font-bold text-white">1 / 5</div>
            <p className="text-xs text-gray-500 mt-1">в этом месяце</p>
          </Card>
          <Card className="p-5 bg-zinc-900/60 border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Video" size={20} className="text-purple-400" />
              <span className="text-gray-400 text-sm">Клипы</span>
            </div>
            <div className="text-3xl font-bold text-white">1 / 1</div>
            <p className="text-xs text-gray-500 mt-1">в этом месяце</p>
          </Card>
        </div>

        <Card className="p-6 bg-zinc-900/60 border-red-500/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-orbitron">Мои файлы</h2>
          </div>
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { id: "all", label: "Все" },
              { id: "track", label: "Треки" },
              { id: "lyrics", label: "Тексты" },
              { id: "clip", label: "Клипы" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as "all" | "track" | "lyrics" | "clip")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === t.id
                    ? "bg-red-500 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-40" />
                <p>Пока пусто. Создай свой первый файл!</p>
              </div>
            )}
            {filtered.map((item) => {
              const meta = typeLabels[item.type]
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-black/40 border border-red-500/10 hover:border-red-500/30 transition"
                >
                  <div className={`w-12 h-12 rounded-lg ${meta.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={meta.icon} size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{item.title}</div>
                    <div className="text-gray-500 text-xs flex items-center gap-3 mt-1">
                      <span>{meta.label}</span>
                      <span>•</span>
                      <span>{item.createdAt}</span>
                      {item.duration && (
                        <>
                          <span>•</span>
                          <span>{item.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(item)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Icon name="Download" size={18} />
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-900/10 border-red-500/30">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 font-orbitron">Хочешь больше треков?</h3>
              <p className="text-gray-300">Обнови тариф и снимай ограничения на генерацию и хранилище.</p>
            </div>
            <Button onClick={() => navigate("/billing")} className="bg-red-500 hover:bg-red-600 text-white">
              Сменить тариф
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
