"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Menu, X, ShoppingCart, User, LogOut, Heart, Package, Settings, ChevronDown } from "lucide-react"

export default function Navbar({ user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [cartCount, setCartCount] = useState(0)
    const router = useRouter()

    useEffect(() => {
        // Get cart count from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        setCartCount(cart.length)

        // Update cart count when localStorage changes
        const handleStorageChange = () => {
            const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]")
            setCartCount(updatedCart.length)
        }

        window.addEventListener("storage", handleStorageChange)

        // Also listen for custom event for when cart is updated in the same window
        window.addEventListener("cartUpdated", handleStorageChange)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
            window.removeEventListener("cartUpdated", handleStorageChange)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user")
        router.push("/")
        // Reload the page to update the UI
        window.location.reload()
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold text-emerald-600">ReThread</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className={`text-gray-600 hover:text-emerald-600 ${router.pathname === "/" ? "text-emerald-600" : ""}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className={`text-gray-600 hover:text-emerald-600 ${router.pathname.startsWith("/products") ? "text-emerald-600" : ""}`}
                        >
                            Shop
                        </Link>
                        <div className="relative group">
                            <button
                                className="flex items-center text-gray-600 hover:text-emerald-600"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                Categories <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                                <Link
                                    href="/products?category=women"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Women
                                </Link>
                                <Link href="/products?category=men" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Men
                                </Link>
                                <Link
                                    href="/products?category=kids"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Kids
                                </Link>
                                <Link
                                    href="/products?category=accessories"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Accessories
                                </Link>
                            </div>
                        </div>
                        <Link
                            href="/about"
                            className={`text-gray-600 hover:text-emerald-600 ${router.pathname === "/about" ? "text-emerald-600" : ""}`}
                        >
                            About
                        </Link>
                    </nav>

                    {/* Desktop Right Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/cart" className="relative text-gray-600 hover:text-emerald-600">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    className="flex items-center text-gray-600 hover:text-emerald-600"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <User className="h-6 w-6" />
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-gray-500">{user.email}</p>
                                        </div>
                                        {(user.role === "seller" || user.role === "both") && (
                                            <Link
                                                href="/seller/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <div className="flex items-center">
                                                    <Package className="h-4 w-4 mr-2" />
                                                    Seller Dashboard
                                                </div>
                                            </Link>
                                        )}
                                        {user.role === "admin" && (
                                            <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <div className="flex items-center">
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Admin Dashboard
                                                </div>
                                            </Link>
                                        )}
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 mr-2" />
                                                My Profile
                                            </div>
                                        </Link>
                                        <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <div className="flex items-center">
                                                <Heart className="h-4 w-4 mr-2" />
                                                Wishlist
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center">
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="text-gray-600 hover:text-emerald-600">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link href="/cart" className="relative text-gray-600">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-emerald-600 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="container mx-auto px-4 py-2">
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/"
                                className={`py-2 ${router.pathname === "/" ? "text-emerald-600" : "text-gray-600"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                className={`py-2 ${router.pathname.startsWith("/products") ? "text-emerald-600" : "text-gray-600"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Shop
                            </Link>
                            <div className="py-2">
                                <button className="flex items-center text-gray-600 mb-1">
                                    Categories <ChevronDown className="ml-1 h-4 w-4" />
                                </button>
                                <div className="pl-4 space-y-1">
                                    <Link
                                        href="/products?category=women"
                                        className="block py-1 text-gray-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Women
                                    </Link>
                                    <Link
                                        href="/products?category=men"
                                        className="block py-1 text-gray-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Men
                                    </Link>
                                    <Link
                                        href="/products?category=kids"
                                        className="block py-1 text-gray-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Kids
                                    </Link>
                                    <Link
                                        href="/products?category=accessories"
                                        className="block py-1 text-gray-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Accessories
                                    </Link>
                                </div>
                            </div>
                            <Link
                                href="/about"
                                className={`py-2 ${router.pathname === "/about" ? "text-emerald-600" : "text-gray-600"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>

                            {user ? (
                                <>
                                    <div className="py-2 border-t border-gray-200">
                                        <div className="py-2">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        {(user.role === "seller" || user.role === "both") && (
                                            <Link
                                                href="/seller/dashboard"
                                                className="flex items-center py-2 text-gray-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Package className="h-4 w-4 mr-2" />
                                                Seller Dashboard
                                            </Link>
                                        )}
                                        {user.role === "admin" && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="flex items-center py-2 text-gray-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href="/profile"
                                            className="flex items-center py-2 text-gray-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="flex items-center py-2 text-gray-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Heart className="h-4 w-4 mr-2" />
                                            Wishlist
                                        </Link>
                                        <button onClick={handleLogout} className="flex items-center py-2 text-gray-600 w-full">
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                                    <Link href="/login" className="py-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}

