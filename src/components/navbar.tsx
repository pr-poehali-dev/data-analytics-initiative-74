import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/95 backdrop-blur-md border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-orbitron text-xl font-bold text-white">
              Synapse<span className="text-red-500">AI</span>
            </h1>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#features"
                className="font-geist text-white hover:text-red-500 transition-colors duration-200"
              >
                Возможности
              </a>
              <a href="#pricing" className="font-geist text-white hover:text-red-500 transition-colors duration-200">
                Тарифы
              </a>
              <a href="#faq" className="font-geist text-white hover:text-red-500 transition-colors duration-200">
                Вопросы
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white hover:text-red-500 hover:bg-transparent font-geist"
              onClick={() => navigate("/login")}
            >
              Войти
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white font-geist border-0"
              onClick={() => navigate("/register")}
            >
              Создать трек
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-500 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/98 border-t border-red-500/20">
              <a
                href="#features"
                className="block px-3 py-2 font-geist text-white hover:text-red-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Возможности
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 font-geist text-white hover:text-red-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Тарифы
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 font-geist text-white hover:text-red-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Вопросы
              </a>
              <div className="px-3 py-2 space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-red-500/50 text-white hover:bg-red-500/10 font-geist"
                  onClick={() => { setIsOpen(false); navigate("/login") }}
                >
                  Войти
                </Button>
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-geist border-0"
                  onClick={() => { setIsOpen(false); navigate("/register") }}
                >
                  Создать трек
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}