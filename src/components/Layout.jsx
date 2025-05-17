import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
    return (
        <div className="relative min-h-screen w-full bg-inherit text-gray-800 dark:text-white transition-colors duration-300">

        <Navbar />
            <main className="relative z-10 w-full px-4 py-6 sm:px-8">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout
