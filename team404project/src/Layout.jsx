import React from 'react'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg- dark:bg-black text-black dark:text-white ">
      <Header />
      <main className="flex-1 flex justify-center items-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
