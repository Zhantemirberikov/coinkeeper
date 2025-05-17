// src/pages/NotFound.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 px-4 text-center">
            <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
            <p className="text-lg mb-6">Упс! Такой страницы не существует.</p>
            <Link
                to="/dashboard"
                className="text-blue-500 hover:underline text-sm"
            >
                ⬅ Вернуться на главную
            </Link>
        </div>
    )
}
