"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { allProducts } from "../../utils/data"
import { Package, DollarSign, Users, TrendingUp, Edit, Trash2, Plus, Search, Filter, ChevronDown } from "lucide-react"

export default function SellerDashboard() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    useEffect(() => {
        // Check if user is logged in and is a seller
        const checkAuth = () => {
            const userData = JSON.parse(localStorage.getItem("user") || "null")
            if (!userData || (userData.role !== "seller" && userData.role !== "both" && userData.role !== "admin")) {
                router.push("/login")
                return
            }
            setUser(userData)
        }

        // Load seller's products
        const loadProducts = () => {
            setLoading(true)
            try {
                // In a real app, this would filter products by seller ID
                // For demo, we'll just use some of the products
                const sellerProducts = allProducts.filter((product, index) => index % 3 === 0)
                setProducts(sellerProducts)
            } catch (error) {
                console.error("Error loading products:", error)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
        loadProducts()
    }, [router])

    const handleDeleteProduct = (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((product) => product.id !== productId))
        }
    }

    const filteredProducts = products.filter((product) => {
        // Apply search filter
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Apply status filter
        let matchesStatus = true
        if (filterStatus === "active") {
            matchesStatus = product.status === "active"
        } else if (filterStatus === "pending") {
            matchesStatus = product.status === "pending"
        } else if (filterStatus === "sold") {
            matchesStatus = product.status === "sold"
        }

        return matchesSearch && matchesStatus
    })

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="h-64 bg-gray-200 rounded mb-6"></div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>Seller Dashboard | ReThread</title>
                <meta name="description" content="Manage your products and sales" />
            </Head>

            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {user?.name || "Seller"}</p>
                        </div>
                        <Link
                            href="/seller/upload"
                            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Product
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                                    <h3 className="text-xl font-bold text-gray-900">{products.length}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Sales</p>
                                    <h3 className="text-xl font-bold text-gray-900">₹12,450</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                                    <h3 className="text-xl font-bold text-gray-900">24</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Avg. Rating</p>
                                    <h3 className="text-xl font-bold text-gray-900">4.8/5</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Your Products</h2>
                        </div>

                        {/* Search and Filter */}
                        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="relative w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        onClick={() => document.getElementById("filter-menu").classList.toggle("hidden")}
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </button>
                                    <div
                                        id="filter-menu"
                                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden"
                                    >
                                        <div className="py-1">
                                            <button
                                                onClick={() => setFilterStatus("all")}
                                                className={`block px-4 py-2 text-sm w-full text-left ${filterStatus === "all" ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                    }`}
                                            >
                                                All Products
                                            </button>
                                            <button
                                                onClick={() => setFilterStatus("active")}
                                                className={`block px-4 py-2 text-sm w-full text-left ${filterStatus === "active" ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                    }`}
                                            >
                                                Active
                                            </button>
                                            <button
                                                onClick={() => setFilterStatus("pending")}
                                                className={`block px-4 py-2 text-sm w-full text-left ${filterStatus === "pending" ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                    }`}
                                            >
                                                Pending Approval
                                            </button>
                                            <button
                                                onClick={() => setFilterStatus("sold")}
                                                className={`block px-4 py-2 text-sm w-full text-left ${filterStatus === "sold" ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                    }`}
                                            >
                                                Sold
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            {filteredProducts.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-gray-500">No products found. Try adjusting your search or filter.</p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Product
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Price
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Listed Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Views
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                                                            <img
                                                                src={product.images[0] || "/placeholder.svg?height=40&width=40"}
                                                                alt={product.name}
                                                                className="h-10 w-10 object-cover"
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                            <div className="text-sm text-gray-500">{product.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">₹{product.price.toFixed(2)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === "active"
                                                                ? "bg-green-100 text-green-800"
                                                                : product.status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : product.status === "sold"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {product.status || "Active"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(product.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.views || Math.floor(Math.random() * 100)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={`/seller/edit/${product.id}`}
                                                            className="text-emerald-600 hover:text-emerald-900"
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <DollarSign className="h-4 w-4 text-emerald-600" />
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">New order received</p>
                                        <p className="text-sm text-gray-500">Order #12345 for Beach Bliss Flip-Flops</p>
                                        <p className="text-xs text-gray-400">2 hours ago</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">New message from buyer</p>
                                        <p className="text-sm text-gray-500">Priya has a question about Sunset Shades Sunglasses</p>
                                        <p className="text-xs text-gray-400">5 hours ago</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Package className="h-4 w-4 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Product approved</p>
                                        <p className="text-sm text-gray-500">Your listing for Summer Breeze T-Shirt has been approved</p>
                                        <p className="text-xs text-gray-400">1 day ago</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

