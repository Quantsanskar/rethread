"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout({ children }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem("user") || "null")
    setUser(userData)
  }, [])

  // Check if current page is login or register
  const isAuthPage = router.pathname === "/login" || router.pathname === "/register"

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar user={user} />}
      <main className="flex-grow">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

