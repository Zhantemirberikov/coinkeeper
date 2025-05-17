import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

  return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Фоновая GIF */}
        <img
            src="/money1.gif"
            alt="Background animation"
            className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Полупрозрачная подложка */}
        <div className="absolute inset-0 bg-white/13 dark:bg-black/70" />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          {/* Большой полупрозрачный логотип */}
          <h1 className="absolute inset-x-0 top-1/50 text-center text-yellow-400 font-extrabold uppercase text-[6rem] md:text-[8rem] lg:text-[10rem] opacity-20 select-none pointer-events-none">
            CoinKeeper
          </h1>

          <form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg border-4 border-amber-500 animate-pulse-border p-8 space-y-6"
          >
            <h2 className="text-3xl font-bold text-center text-amber-500">
              Войти
            </h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Пароль</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 font-semibold bg-amber-500 text-white rounded hover:bg-amber-600 transition"
            >
              {status === 'loading' ? 'Загрузка...' : 'Войти'}
            </button>

            <p className="text-center text-sm text-gray-800 dark:text-gray-200">
              Нет аккаунта?{' '}
              <Link
                  to="/register"
                  className="text-amber-500 hover:text-amber-600 font-medium"
              >
                Зарегистрироваться
              </Link>
            </p>
          </form>
        </div>
      </div>
  )
}
