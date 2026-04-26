import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import Icon from "@/components/ui/icon"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Заполни все поля")
      return
    }
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("synapse_user", JSON.stringify({ email, name: email.split("@")[0], plan: "Free" }))
      toast.success("Добро пожаловать!")
      navigate("/dashboard")
    }, 600)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 dark">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-black pointer-events-none" />
      <Card className="relative w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur border-red-500/20">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-red-500 mb-6 text-sm">
          <Icon name="ArrowLeft" size={16} />
          На главную
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 font-orbitron">
            Synapse<span className="text-red-500">AI</span>
          </h1>
          <p className="text-gray-400">Войди в свой кабинет</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-black/40 border-red-500/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white mb-2 block">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black/40 border-red-500/20 text-white"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white">
            {loading ? "Входим..." : "Войти"}
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-red-500 hover:text-red-400">
            Зарегистрироваться
          </Link>
        </p>
      </Card>
    </div>
  )
}
