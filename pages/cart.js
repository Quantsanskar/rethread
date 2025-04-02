"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"

export default function Cart() {
    const router = useRouter()
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load cart from localStorage
        const loadCart = () => {
            setLoading(true)
            try {
                const cart = JSON.parse(localStorage.getItem("cart") || "[]")
                setCartItems(cart)
            } catch (error) {
                console.error("Error loading cart:", error)
                setCartItems([])
            } finally {
                setLoading(false)
            }
        }

        loadCart()
    }, [])

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return

        const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

        setCartItems(updatedCart)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
    }

    const removeItem = (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id)
        setCartItems(updatedCart)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
    }

    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem("cart")
    }

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const calculateTax = () => {
        return calculateSubtotal() * 0.05 // 5% tax
    }

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax()
    }

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!")
            return
        }

        router.push("/checkout")
    }

    return (
        <Layout>
            <Head>
                <title>Your Cart | ReThread</title>
                <meta name="description" content="View and manage your shopping cart" />
            </Head>

            <div className="bg-white">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

                    {loading ? (
                        <div className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded mb-4"></div>
                            <div className="h-16 bg-gray-200 rounded mb-4"></div>
                            <div className="h-16 bg-gray-200 rounded mb-4"></div>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
                            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="border-b border-gray-200 pb-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={clearCart}
                                            className="text-sm font-medium text-red-600 hover:text-red-500"
                                        >
                                            Clear Cart
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-200 pb-6">
                                            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={item.image || "/placeholder.svg?height=100&width=100"}
                                                    alt={item.name}
                                                    className="w-full h-full object-center object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="text-base font-medium text-gray-900">
                                                            <Link href={`/products/${item.id}`} className="hover:text-emerald-600">
                                                                {item.name}
                                                            </Link>
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500">Seller: {item.seller}</p>
                                                    </div>
                                                    <p className="text-base font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-gray-300 rounded-md">
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1 text-gray-600 hover:text-gray-700"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                                            className="w-12 text-center border-0 focus:ring-0"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1 text-gray-600 hover:text-gray-700"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                                    <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <p className="text-base text-gray-500">Subtotal</p>
                                            <p className="text-base font-medium text-gray-900">₹{calculateSubtotal().toFixed(2)}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-base text-gray-500">Tax (5%)</p>
                                            <p className="text-base font-medium text-gray-900">₹{calculateTax().toFixed(2)}</p>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4 flex justify-between">
                                            <p className="text-base font-medium text-gray-900">Total</p>
                                            <p className="text-base font-medium text-gray-900">₹{calculateTotal().toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCheckout}
                                        className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        Checkout
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </button>

                                    <div className="mt-6 text-center">
                                        <Link href="/products" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

