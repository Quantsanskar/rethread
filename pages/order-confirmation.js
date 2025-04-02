"use client"

import { useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { CheckCircle } from "lucide-react"

export default function OrderConfirmation() {
    const router = useRouter()

    useEffect(() => {
        // If no cart was in localStorage, redirect to home
        if (!localStorage.getItem("cart")) {
            // We'll still allow viewing the confirmation page directly
            // But in a real app, you might want to redirect if there's no order data
        }
    }, [router])

    const orderNumber = Math.floor(100000 + Math.random() * 900000) // Generate random order number
    const orderDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <Layout>
            <Head>
                <title>Order Confirmation | ReThread</title>
                <meta name="description" content="Your order has been confirmed" />
            </Head>

            <div className="bg-white">
                <div className="container mx-auto px-4 py-16 sm:py-24">
                    <div className="max-w-3xl mx-auto text-center">
                        <CheckCircle className="h-24 w-24 text-emerald-600 mx-auto mb-6" />
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Thank You for Your Order!</h1>
                        <p className="mt-4 text-xl text-gray-500">Your order has been confirmed and will be processed shortly.</p>

                        <div className="mt-10 bg-gray-50 rounded-lg p-8 text-left">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Order Number</p>
                                    <p className="font-medium">{orderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-medium">{orderDate}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    We've sent a confirmation email to your email address with all the details of your order.
                                </p>
                                <p className="text-sm text-gray-500">You can also track your order status in your account dashboard.</p>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

