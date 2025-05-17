import React, { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useTheme } from '../hooks/useTheme'

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const user = useSelector((state) => state.auth.user)

    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login', { replace: true })
    }

    const handleToggleMusic = () => {
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const linkStyle = ({ isActive }) =>
        isActive
            ? 'text-blue-600 dark:text-blue-400 font-semibold underline'
            : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition'

    return (
        <header className="relative shadow-md transition-colors duration-300 overflow-hidden">
            {/* Фоновая гифка */}
            <img
                src="/coin3.gif"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-22 pointer-events-none"
            />

            {/* Полупрозрачная подложка для читаемости */}
            <div className="absolute inset-0 bg-white/20 dark:bg-black/60" />

            {/* Контент навбара */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    💰 CoinKeeper
                </h1>

                <nav className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
                    <NavLink to="/dashboard" className={linkStyle}>
                        Главная
                    </NavLink>
                    <NavLink to="/stats" className={linkStyle}>
                        Статистика
                    </NavLink>
                    <NavLink to="/settings" className={linkStyle}>
                        Категории
                    </NavLink>

                    <button
                        onClick={toggleTheme}
                        className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                    >
                        {theme === 'dark' ? '☀ Светлая' : '🌙 Тёмная'}
                    </button>

                    <button
                        onClick={handleToggleMusic}
                        className="text-gray-500 dark:text-gray-300 hover:text-yellow-400 transition"
                    >
                        {isPlaying ? '🔊 Остановить' : '🎵 Музыка'}
                    </button>

                    {user && (
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                            👤 {user.email}
                        </span>
                    )}

                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:underline"
                    >
                        Выйти
                    </button>
                </nav>
            </div>
            <audio ref={audioRef} loop>
                <source src="/money2.mp3" type="audio/mpeg" />
            </audio>
        </header>
    )
}

export default Navbar
