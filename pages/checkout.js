"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { Check, ChevronRight } from "lucide-react"

export default function Checkout() {
    const router = useRouter()
    const [cartItems, setCartItems] = useState([])
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        // Shipping Information
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        // Payment Information
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        // Load cart from localStorage
        const loadCart = () => {
            setLoading(true)
            try {
                const cart = JSON.parse(localStorage.getItem("cart") || "[]")
                if (cart.length === 0) {
                    // Redirect to cart if empty
                    router.push("/cart")
                    return
                }
                setCartItems(cart)
            } catch (error) {
                console.error("Error loading cart:", error)
                setCartItems([])
            } finally {
                setLoading(false)
            }
        }

        loadCart()
    }, [router])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }

    const validateStep = (currentStep) => {
        const newErrors = {}

        if (currentStep === 1) {
            // Validate shipping information
            if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
            if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
            if (!formData.email.trim()) {
                newErrors.email = "Email is required"
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "Email is invalid"
            }
            if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
            if (!formData.address.trim()) newErrors.address = "Address is required"
            if (!formData.city.trim()) newErrors.city = "City is required"
            if (!formData.state.trim()) newErrors.state = "State is required"
            if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required"
        } else if (currentStep === 2) {
            // Validate payment information
            if (!formData.cardName.trim()) newErrors.cardName = "Name on card is required"
            if (!formData.cardNumber.trim()) {
                newErrors.cardNumber = "Card number is required"
            } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
                newErrors.cardNumber = "Card number must be 16 digits"
            }
            if (!formData.expiryDate.trim()) {
                newErrors.expiryDate = "Expiry date is required"
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
                newErrors.expiryDate = "Expiry date must be in MM/YY format"
            }
            if (!formData.cvv.trim()) {
                newErrors.cvv = "CVV is required"
            } else if (!/^\d{3,4}$/.test(formData.cvv)) {
                newErrors.cvv = "CVV must be 3 or 4 digits"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1)
            window.scrollTo(0, 0)
        }
    }

    const prevStep = () => {
        setStep(step - 1)
        window.scrollTo(0, 0)
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateStep(step)) {
            return
        }

        // Simulate order processing
        setLoading(true)
        try {
            // In a real app, this would be an API call to process the order
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Clear cart after successful order
            localStorage.removeItem("cart")

            // Redirect to order confirmation
            router.push("/order-confirmation")
        } catch (error) {
            console.error("Error processing order:", error)
            alert("There was an error processing your order. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="h-10 bg-gray-200 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-40 bg-gray-200 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>Checkout | ReThread</title>
                <meta name="description" content="Complete your purchase" />
            </Head>

            <div className="bg-white">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                    {/* Checkout Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center relative">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {step > 1 ? <Check className="h-6 w-6" /> : 1}
                                </div>
                                <div className="text-sm font-medium text-gray-900 ml-2">Shipping</div>
                            </div>
                            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
                            <div className="flex items-center relative">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {step > 2 ? <Check className="h-6 w-6" /> : 2}
                                </div>
                                <div className="text-sm font-medium text-gray-900 ml-2">Payment</div>
                            </div>
                            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
                            <div className="flex items-center relative">
                                <div
                                    className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 3 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    3
                                </div>
                                <div className="text-sm font-medium text-gray-900 ml-2">Review</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {step === 1 && (
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 mb-6">Shipping Information</h2>
                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full border ${errors.firstName ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full border ${errors.lastName ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full border ${errors.email ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full border ${errors.phone ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full border ${errors.address ? "border-red-300" : "border-gray-300"
                                                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                            />
                                            {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full border ${errors.city ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full border ${errors.state ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.state && <p className="mt-2 text-sm text-red-600">{errors.state}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                                                    Pincode
                                                </label>
                                                <input
                                                    type="text"
                                                    id="pincode"
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full border ${errors.pincode ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.pincode && <p className="mt-2 text-sm text-red-600">{errors.pincode}</p>}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 mb-6">Payment Information</h2>
                                    <form className="space-y-6">
                                        <div>
                                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                                                Name on Card
                                            </label>
                                            <input
                                                type="text"
                                                id="cardName"
                                                name="cardName"
                                                value={formData.cardName}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full border ${errors.cardName ? "border-red-300" : "border-gray-300"
                                                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                            />
                                            {errors.cardName && <p className="mt-2 text-sm text-red-600">{errors.cardName}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleChange}
                                                placeholder="XXXX XXXX XXXX XXXX"
                                                className={`mt-1 block w-full border ${errors.cardNumber ? "border-red-300" : "border-gray-300"
                                                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                            />
                                            {errors.cardNumber && <p className="mt-2 text-sm text-red-600">{errors.cardNumber}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleChange}
                                                    placeholder="MM/YY"
                                                    className={`mt-1 block w-full border ${errors.expiryDate ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.expiryDate && <p className="mt-2 text-sm text-red-600">{errors.expiryDate}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    id="cvv"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleChange}
                                                    placeholder="XXX"
                                                    className={`mt-1 block w-full border ${errors.cvv ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                                {errors.cvv && <p className="mt-2 text-sm text-red-600">{errors.cvv}</p>}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="text-sm text-gray-500">
                                                Your payment information is secure. We use industry-standard encryption to protect your data.
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {step === 3 && (
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 mb-6">Review Your Order</h2>

                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Information</h3>
                                            <div className="bg-gray-50 p-4 rounded-md">
                                                <p className="text-sm text-gray-700">
                                                    {formData.firstName} {formData.lastName}
                                                    <br />
                                                    {formData.address}
                                                    <br />
                                                    {formData.city}, {formData.state} {formData.pincode}
                                                    <br />
                                                    {formData.email}
                                                    <br />
                                                    {formData.phone}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                                            <div className="bg-gray-50 p-4 rounded-md">
                                                <p className="text-sm text-gray-700">
                                                    {formData.cardName}
                                                    <br />
                                                    Card ending in {formData.cardNumber.slice(-4)}
                                                    <br />
                                                    Expires {formData.expiryDate}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                                            <div className="border rounded-md divide-y divide-gray-200">
                                                {cartItems.map((item) => (
                                                    <div key={item.id} className="flex items-center p-4">
                                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                                            <img
                                                                src={item.image || "/placeholder.svg?height=100&width=100"}
                                                                alt={item.name}
                                                                className="w-full h-full object-center object-cover"
                                                            />
                                                        </div>
                                                        <div className="ml-4 flex-1">
                                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            ₹{(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex justify-between">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        Back
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ml-auto"
                                    >
                                        Next
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ml-auto disabled:opacity-50"
                                    >
                                        {loading ? "Processing..." : "Place Order"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <div>
                                                <span className="font-medium">{item.quantity}x</span> {item.name}
                                            </div>
                                            <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>

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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

