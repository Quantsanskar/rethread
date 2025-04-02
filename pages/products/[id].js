"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "../../components/Layout"
import { allProducts } from "../../utils/data"
import { Heart, Share2, MessageCircle, ArrowLeft, Star, ShoppingCart } from "lucide-react"

export default function ProductDetail() {
    const router = useRouter()
    const { id } = router.query
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (id) {
            // Simulate API call to fetch product details
            const fetchProduct = async () => {
                setLoading(true)
                try {
                    // In a real app, this would be an API call
                    await new Promise((resolve) => setTimeout(resolve, 500))
                    const foundProduct = allProducts.find((p) => p.id.toString() === id)
                    setProduct(foundProduct || null)
                } catch (error) {
                    console.error("Error fetching product:", error)
                } finally {
                    setLoading(false)
                }
            }

            fetchProduct()
        }
    }, [id])

    const handleAddToCart = () => {
        // Get existing cart from localStorage or initialize empty array
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")

        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex((item) => item.id === product.id)

        if (existingProductIndex >= 0) {
            // Update quantity if product already in cart
            cart[existingProductIndex].quantity += quantity
        } else {
            // Add new product to cart
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity,
                seller: product.seller,
            })
        }

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart))

        // Show success message or redirect to cart
        alert("Product added to cart!")
    }

    const handleContactSeller = () => {
        alert("This feature would connect you with the seller via messaging.")
    }

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="h-96 bg-gray-200 rounded"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-24 bg-gray-200 rounded w-full"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!product) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
                    <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Browse all products
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>{product.name} | ReThread</title>
                <meta name="description" content={product.description} />
            </Head>

            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <Link href="/products" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to products
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover"
                                />
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${selectedImage === index ? "ring-2 ring-emerald-500" : "ring-1 ring-gray-200"
                                            }`}
                                    >
                                        <img
                                            src={image || "/placeholder.svg?height=100&width=100"}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="w-full h-full object-center object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Listed by <span className="font-medium text-emerald-600">{product.seller}</span> on{" "}
                                    {new Date(product.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <Star
                                            key={rating}
                                            className={`h-5 w-5 ${product.rating > rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="ml-2 text-sm text-gray-500">{product.reviews} reviews</p>
                            </div>

                            <div>
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl text-gray-900">₹{product.price.toFixed(2)}</p>
                                {product.originalPrice && (
                                    <p className="text-sm text-gray-500 line-through mt-1">
                                        Original: ₹{product.originalPrice.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                                <p className="mt-1 text-sm text-gray-500">{product.condition}</p>
                            </div>

                            {product.size && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                                </div>
                            )}

                            {product.color && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                    <div className="mt-1 flex items-center">
                                        <span
                                            className="h-6 w-6 rounded-full border border-gray-200"
                                            style={{ backgroundColor: product.colorCode || "#000" }}
                                        ></span>
                                        <span className="ml-2 text-sm text-gray-500">{product.color}</span>
                                    </div>
                                </div>
                            )}

                            {product.brand && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Brand</h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                                <div className="mt-2 text-sm text-gray-500 space-y-2">
                                    <p>{product.description}</p>
                                    {product.reasonForSelling && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-900">Reason for selling</h4>
                                            <p className="mt-1 text-sm text-gray-500">{product.reasonForSelling}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex items-center mb-4">
                                    <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-900">
                                        Quantity
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button
                                            type="button"
                                            className="px-3 py-1 text-gray-600 hover:text-gray-700"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                                            className="w-12 text-center border-0 focus:ring-0"
                                        />
                                        <button
                                            type="button"
                                            className="px-3 py-1 text-gray-600 hover:text-gray-700"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleContactSeller}
                                        className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        <MessageCircle className="h-5 w-5 mr-2" />
                                        Contact Seller
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 pt-2">
                                <button type="button" className="flex items-center text-gray-500 hover:text-gray-700">
                                    <Heart className="h-5 w-5 mr-1" />
                                    <span className="text-sm">Save</span>
                                </button>
                                <button type="button" className="flex items-center text-gray-500 hover:text-gray-700">
                                    <Share2 className="h-5 w-5 mr-1" />
                                    <span className="text-sm">Share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="mt-16 border-t border-gray-200 pt-10">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button className="border-emerald-500 text-emerald-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                    Product Details
                                </button>
                                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                    Reviews ({product.reviews})
                                </button>
                                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                    Seller Information
                                </button>
                            </nav>
                        </div>

                        <div className="py-6 prose prose-sm max-w-none">
                            <h3>Product Details</h3>
                            <p>{product.description}</p>

                            <h4>Features</h4>
                            <ul>
                                <li>Condition: {product.condition}</li>
                                {product.brand && <li>Brand: {product.brand}</li>}
                                {product.size && <li>Size: {product.size}</li>}
                                {product.color && <li>Color: {product.color}</li>}
                                {product.material && <li>Material: {product.material}</li>}
                            </ul>

                            {product.reasonForSelling && (
                                <>
                                    <h4>Reason for Selling</h4>
                                    <p>{product.reasonForSelling}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Similar Products */}
                    <div className="mt-16">
                        <h2 className="text-xl font-bold text-gray-900">Similar Products</h2>
                        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {allProducts
                                .filter((p) => p.category === product.category && p.id !== product.id)
                                .slice(0, 4)
                                .map((similarProduct) => (
                                    <div key={similarProduct.id} className="group relative">
                                        <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                                            <img
                                                src={similarProduct.images[0] || "/placeholder.svg?height=300&width=300"}
                                                alt={similarProduct.name}
                                                className="w-full h-full object-center object-cover"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <h3 className="text-sm text-gray-700">
                                                    <Link href={`/products/${similarProduct.id}`}>
                                                        <span aria-hidden="true" className="absolute inset-0" />
                                                        {similarProduct.name}
                                                    </Link>
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">{similarProduct.color}</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">₹{similarProduct.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

