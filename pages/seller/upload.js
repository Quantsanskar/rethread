"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { Upload, X, Plus, ArrowLeft } from "lucide-react"

export default function UploadProduct() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([null, null, null, null, null])
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        originalPrice: "",
        brand: "",
        size: "",
        color: "",
        condition: "",
        reasonForSelling: "",
    })
    const [errors, setErrors] = useState({})

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

        checkAuth()
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

    const handleImageChange = (index, e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file")
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const newImages = [...images]
            newImages[index] = reader.result
            setImages(newImages)
        }
        reader.readAsDataURL(file)
    }

    const removeImage = (index) => {
        const newImages = [...images]
        newImages[index] = null
        setImages(newImages)
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = "Product name is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        if (!formData.category) newErrors.category = "Category is required"
        if (!formData.price) {
            newErrors.price = "Price is required"
        } else if (isNaN(formData.price) || Number.parseFloat(formData.price) <= 0) {
            newErrors.price = "Price must be a positive number"
        }
        if (formData.originalPrice && (isNaN(formData.originalPrice) || Number.parseFloat(formData.originalPrice) <= 0)) {
            newErrors.originalPrice = "Original price must be a positive number"
        }
        if (!formData.condition) newErrors.condition = "Condition is required"

        // Check if at least one image is uploaded
        if (!images.some((img) => img !== null)) {
            newErrors.images = "At least one image is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            // Scroll to the first error
            const firstError = document.querySelector(".text-red-600")
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            return
        }

        setLoading(true)

        try {
            // Simulate API call to upload product
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // In a real app, this would be an API call to create the product
            alert("Product uploaded successfully! It will be reviewed by our team.")

            // Redirect to seller dashboard
            router.push("/seller/dashboard")
        } catch (error) {
            console.error("Error uploading product:", error)
            alert("There was an error uploading your product. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <Head>
                <title>Upload Product | ReThread</title>
                <meta name="description" content="Upload a new product to sell" />
            </Head>

            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                        </button>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h1 className="text-2xl font-bold text-gray-900">Upload a New Product</h1>
                                <p className="text-gray-600 mt-1">Fill in the details below to list your item for sale</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Product Images */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Images
                                        {errors.images && <span className="text-red-600 ml-2">{errors.images}</span>}
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative">
                                                {image ? (
                                                    <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                                                        <img
                                                            src={image || "/placeholder.svg"}
                                                            alt={`Product image ${index + 1}`}
                                                            className="w-full h-full object-center object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                                                        >
                                                            <X className="h-4 w-4 text-gray-500" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                                            <Plus className="h-8 w-8 text-gray-400" />
                                                            <span className="text-xs text-gray-500 mt-1">Add Image</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(index, e)}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Upload up to 5 images. First image will be the cover image.
                                    </p>
                                </div>

                                {/* Basic Information */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Product Name
                                                {errors.name && <span className="text-red-600 ml-2">{errors.name}</span>}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full border ${errors.name ? "border-red-300" : "border-gray-300"
                                                    } rounded-md shadow-sm py-2 px-
3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                Description
                                                {errors.description && <span className="text-red-600 ml-2">{errors.description}</span>}
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows="4"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full border ${errors.description ? "border-red-300" : "border-gray-300"
                                                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                placeholder="Describe your item, including any flaws or wear and tear"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                                Category
                                                {errors.category && <span className="text-red-600 ml-2">{errors.category}</span>}
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full border ${errors.category ? "border-red-300" : "border-gray-300"
                                                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                            >
                                                <option value="">Select a category</option>
                                                <option value="Women">Women</option>
                                                <option value="Men">Men</option>
                                                <option value="Kids">Kids</option>
                                                <option value="Accessories">Accessories</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                                    Price (₹)
                                                    {errors.price && <span className="text-red-600 ml-2">{errors.price}</span>}
                                                </label>
                                                <input
                                                    type="number"
                                                    id="price"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    min="0"
                                                    step="0.01"
                                                    className={`mt-1 block w-full border ${errors.price ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                                                    Original Price (₹) (Optional)
                                                    {errors.originalPrice && <span className="text-red-600 ml-2">{errors.originalPrice}</span>}
                                                </label>
                                                <input
                                                    type="number"
                                                    id="originalPrice"
                                                    name="originalPrice"
                                                    value={formData.originalPrice}
                                                    onChange={handleChange}
                                                    min="0"
                                                    step="0.01"
                                                    className={`mt-1 block w-full border ${errors.originalPrice ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Product Details</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                                                    Brand (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    id="brand"
                                                    name="brand"
                                                    value={formData.brand}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                                                    Size (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    id="size"
                                                    name="size"
                                                    value={formData.size}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                                                    Color (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    id="color"
                                                    name="color"
                                                    value={formData.color}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                                                    Condition
                                                    {errors.condition && <span className="text-red-600 ml-2">{errors.condition}</span>}
                                                </label>
                                                <select
                                                    id="condition"
                                                    name="condition"
                                                    value={formData.condition}
                                                    onChange={handleChange}
                                                    className={`mt-1 block w-full border ${errors.condition ? "border-red-300" : "border-gray-300"
                                                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                                >
                                                    <option value="">Select condition</option>
                                                    <option value="New with tags">New with tags</option>
                                                    <option value="Like new">Like new</option>
                                                    <option value="Good">Good</option>
                                                    <option value="Fair">Fair</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="reasonForSelling" className="block text-sm font-medium text-gray-700">
                                                Reason for Selling (Optional)
                                            </label>
                                            <textarea
                                                id="reasonForSelling"
                                                name="reasonForSelling"
                                                rows="3"
                                                value={formData.reasonForSelling}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                                placeholder="Why are you selling this item? (e.g., doesn't fit, never worn, etc.)"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-5 w-5 mr-2" />
                                                Upload Product
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="text-xs text-gray-500">
                                    <p>
                                        By uploading this product, you agree to our{" "}
                                        <a href="#" className="text-emerald-600 hover:text-emerald-500">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-emerald-600 hover:text-emerald-500">
                                            Community Guidelines
                                        </a>
                                        .
                                    </p>
                                    <p className="mt-1">
                                        Your product will be reviewed by our team before being listed on the marketplace.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

