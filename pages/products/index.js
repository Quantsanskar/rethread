"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import ProductCard from "../../components/ProductCard"
import { allProducts } from "../../utils/data"
import { Filter, ChevronDown, X, Search } from "lucide-react"

export default function Products() {
    const router = useRouter()
    const { category, search, sort } = router.query

    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [filters, setFilters] = useState({
        category: category || "",
        priceRange: "",
        condition: [],
        size: [],
        color: [],
        brand: [],
    })
    const [searchQuery, setSearchQuery] = useState(search || "")
    const [sortOption, setSortOption] = useState(sort || "newest")
    const [showFilters, setShowFilters] = useState(false)

    // Initialize products
    useEffect(() => {
        setProducts(allProducts)
    }, [])

    // Update filters when URL query changes
    useEffect(() => {
        if (category) {
            setFilters((prev) => ({ ...prev, category }))
        }
        if (search) {
            setSearchQuery(search)
        }
        if (sort) {
            setSortOption(sort)
        }
    }, [category, search, sort])

    // Apply filters, search, and sort
    useEffect(() => {
        let result = [...products]

        // Apply category filter
        if (filters.category) {
            result = result.filter((product) => product.category.toLowerCase() === filters.category.toLowerCase())
        }

        // Apply price range filter
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split("-").map(Number)
            result = result.filter((product) => product.price >= min && (max ? product.price <= max : true))
        }

        // Apply condition filter
        if (filters.condition.length > 0) {
            result = result.filter((product) => filters.condition.includes(product.condition))
        }

        // Apply size filter
        if (filters.size.length > 0) {
            result = result.filter((product) => filters.size.includes(product.size))
        }

        // Apply color filter
        if (filters.color.length > 0) {
            result = result.filter((product) => filters.color.includes(product.color))
        }

        // Apply brand filter
        if (filters.brand.length > 0) {
            result = result.filter((product) => filters.brand.includes(product.brand))
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query) ||
                    product.brand.toLowerCase().includes(query),
            )
        }

        // Apply sort
        switch (sortOption) {
            case "newest":
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            case "price-low":
                result.sort((a, b) => a.price - b.price)
                break
            case "price-high":
                result.sort((a, b) => b.price - a.price)
                break
            case "popular":
                result.sort((a, b) => b.popularity - a.popularity)
                break
            default:
                break
        }

        setFilteredProducts(result)
    }, [products, filters, searchQuery, sortOption])

    const handleFilterChange = (filterType, value) => {
        if (filterType === "category" || filterType === "priceRange") {
            setFilters((prev) => ({
                ...prev,
                [filterType]: value,
            }))
        } else {
            // For array filters (condition, size, color, brand)
            setFilters((prev) => {
                const currentValues = prev[filterType]
                return {
                    ...prev,
                    [filterType]: currentValues.includes(value)
                        ? currentValues.filter((item) => item !== value)
                        : [...currentValues, value],
                }
            })
        }
    }

    const clearFilters = () => {
        setFilters({
            category: "",
            priceRange: "",
            condition: [],
            size: [],
            color: [],
            brand: [],
        })
        setSearchQuery("")
        setSortOption("newest")
        router.push("/products", undefined, { shallow: true })
    }

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(
            {
                pathname: "/products",
                query: { ...router.query, search: searchQuery },
            },
            undefined,
            { shallow: true },
        )
    }

    const handleSortChange = (value) => {
        setSortOption(value)
        router.push(
            {
                pathname: "/products",
                query: { ...router.query, sort: value },
            },
            undefined,
            { shallow: true },
        )
    }

    // Filter options
    const conditions = ["New with tags", "Like new", "Good", "Fair"]
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
    const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Brown", "Gray"]
    const brands = ["Nike", "Adidas", "Zara", "H&M", "Levis", "Gap", "Gucci", "Prada", "Uniqlo", "Other"]
    const categories = ["Women", "Men", "Kids", "Accessories"]
    const priceRanges = [
        { label: "Under ₹500", value: "0-500" },
        { label: "₹500 - ₹1000", value: "500-1000" },
        { label: "₹1000 - ₹2000", value: "1000-2000" },
        { label: "₹2000 - ₹5000", value: "2000-5000" },
        { label: "Over ₹5000", value: "5000-" },
    ]

    return (
        <Layout>
            <Head>
                <title>Shop Products | ReThread</title>
                <meta name="description" content="Browse second-hand clothing at ReThread" />
            </Head>

            <div className="bg-white">
                <div>
                    {/* Mobile filter dialog */}
                    <div className={`fixed inset-0 flex z-40 lg:hidden ${showFilters ? "block" : "hidden"}`}>
                        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowFilters(false)}></div>
                        <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <button
                                    type="button"
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                    onClick={() => setShowFilters(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Mobile filters */}
                            <div className="mt-4 border-t border-gray-200">
                                <div className="px-4 py-6">
                                    <h3 className="text-sm font-medium text-gray-900">Category</h3>
                                    <div className="mt-2 space-y-2">
                                        {categories.map((category) => (
                                            <div key={category} className="flex items-center">
                                                <input
                                                    id={`category-mobile-${category}`}
                                                    name="category"
                                                    value={category}
                                                    type="radio"
                                                    checked={filters.category.toLowerCase() === category.toLowerCase()}
                                                    onChange={() => handleFilterChange("category", category.toLowerCase())}
                                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <label htmlFor={`category-mobile-${category}`} className="ml-3 text-sm text-gray-600">
                                                    {category}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 py-6 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900">Price</h3>
                                    <div className="mt-2 space-y-2">
                                        {priceRanges.map((range) => (
                                            <div key={range.value} className="flex items-center">
                                                <input
                                                    id={`price-mobile-${range.value}`}
                                                    name="price"
                                                    value={range.value}
                                                    type="radio"
                                                    checked={filters.priceRange === range.value}
                                                    onChange={() => handleFilterChange("priceRange", range.value)}
                                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <label htmlFor={`price-mobile-${range.value}`} className="ml-3 text-sm text-gray-600">
                                                    {range.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 py-6 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                                    <div className="mt-2 space-y-2">
                                        {conditions.map((condition) => (
                                            <div key={condition} className="flex items-center">
                                                <input
                                                    id={`condition-mobile-${condition}`}
                                                    name="condition"
                                                    value={condition}
                                                    type="checkbox"
                                                    checked={filters.condition.includes(condition)}
                                                    onChange={() => handleFilterChange("condition", condition)}
                                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <label htmlFor={`condition-mobile-${condition}`} className="ml-3 text-sm text-gray-600">
                                                    {condition}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 py-6 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {sizes.map((size) => (
                                            <div key={size} className="flex items-center">
                                                <input
                                                    id={`size-mobile-${size}`}
                                                    name="size"
                                                    value={size}
                                                    type="checkbox"
                                                    checked={filters.size.includes(size)}
                                                    onChange={() => handleFilterChange("size", size)}
                                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <label htmlFor={`size-mobile-${size}`} className="ml-3 text-sm text-gray-600">
                                                    {size}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 py-6 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {colors.map((color) => (
                                            <div key={color} className="flex items-center">
                                                <input
                                                    id={`color-mobile-${color}`}
                                                    name="color"
                                                    value={color}
                                                    type="checkbox"
                                                    checked={filters.color.includes(color)}
                                                    onChange={() => handleFilterChange("color", color)}
                                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <label htmlFor={`color-mobile-${color}`} className="ml-3 text-sm text-gray-600">
                                                    {color}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 py-6 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900">Brand</h3>
                                    <div className="mt-2 space-y-2">
                                        {brands.map((brand) => (
                                            <div key={brand} className="flex items-center">
                                                <input
                                                    id={`brand-mobile-${brand}`}
                                                    name="brand"
                                                    value={brand}
                                                    type="checkbox"
                                                    checked={filters.brand.includes(brand)}
                                                    onChange={() => handleFilterChange("brand", brand)}
                                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <label htmlFor={`brand-mobile-${brand}`} className="ml-3 text-sm text-gray-600">
                                                    {brand}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {filters.category
                                    ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
                                    : "All Products"}
                            </h1>

                            <div className="flex items-center">
                                <div className="relative inline-block text-left">
                                    <div>
                                        <button
                                            type="button"
                                            className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                                            onClick={() => document.getElementById("sort-menu").classList.toggle("hidden")}
                                        >
                                            Sort
                                            <ChevronDown
                                                className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>

                                    <div
                                        id="sort-menu"
                                        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
                                    >
                                        <div className="py-1">
                                            <button
                                                onClick={() => handleSortChange("newest")}
                                                className={`block px-4 py-2 text-sm w-full text-left ${sortOption === "newest" ? "font-medium text-gray-900" : "text-gray-500"
                                                    }`}
                                            >
                                                Newest
                                            </button>
                                            <button
                                                onClick={() => handleSortChange("price-low")}
                                                className={`block px-4 py-2 text-sm w-full text-left ${sortOption === "price-low" ? "font-medium text-gray-900" : "text-gray-500"
                                                    }`}
                                            >
                                                Price: Low to High
                                            </button>
                                            <button
                                                onClick={() => handleSortChange("price-high")}
                                                className={`block px-4 py-2 text-sm w-full text-left ${sortOption === "price-high" ? "font-medium text-gray-900" : "text-gray-500"
                                                    }`}
                                            >
                                                Price: High to Low
                                            </button>
                                            <button
                                                onClick={() => handleSortChange("popular")}
                                                className={`block px-4 py-2 text-sm w-full text-left ${sortOption === "popular" ? "font-medium text-gray-900" : "text-gray-500"
                                                    }`}
                                            >
                                                Most Popular
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                                    onClick={() => setShowFilters(true)}
                                >
                                    <span className="sr-only">Filters</span>
                                    <Filter className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <section aria-labelledby="products-heading" className="pb-24 pt-6">
                            <h2 id="products-heading" className="sr-only">
                                Products
                            </h2>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                                {/* Filters */}
                                <form >
                                    <div className="border-b border-gray-200 pb-6">
                                        <h3 className="text-sm font-medium text-gray-900">Search</h3>
                                        <div className="mt-2 relative">
                                            <form onSubmit={handleSearch}>
                                                <input
                                                    type="text"
                                                    placeholder="Search products..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                                <Search
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    size={16}
                                                />
                                            </form>
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-200 py-6">
                                        <h3 className="text-sm font-medium text-gray-900">Category</h3>
                                        <div className="mt-2 space-y-2">
                                            {categories.map((category) => (
                                                <div key={category} className="flex items-center">
                                                    <input
                                                        id={`category-${category}`}
                                                        name="category"
                                                        value={category}
                                                        type="radio"
                                                        checked={filters.category.toLowerCase() === category.toLowerCase()}
                                                        onChange={() => handleFilterChange("category", category.toLowerCase())}
                                                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">
                                                        {category}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-200 py-6">
                                        <h3 className="text-sm font-medium text-gray-900">Price</h3>
                                        <div className="mt-2 space-y-2">
                                            {priceRanges.map((range) => (
                                                <div key={range.value} className="flex items-center">
                                                    <input
                                                        id={`price-${range.value}`}
                                                        name="price"
                                                        value={range.value}
                                                        type="radio"
                                                        checked={filters.priceRange === range.value}
                                                        onChange={() => handleFilterChange("priceRange", range.value)}
                                                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <label htmlFor={`price-${range.value}`} className="ml-3 text-sm text-gray-600">
                                                        {range.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-200 py-6">
                                        <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                                        <div className="mt-2 space-y-2">
                                            {conditions.map((condition) => (
                                                <div key={condition} className="flex items-center">
                                                    <input
                                                        id={`condition-${condition}`}
                                                        name="condition"
                                                        value={condition}
                                                        type="checkbox"
                                                        checked={filters.condition.includes(condition)}
                                                        onChange={() => handleFilterChange("condition", condition)}
                                                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <label htmlFor={`condition-${condition}`} className="ml-3 text-sm text-gray-600">
                                                        {condition}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-200 py-6">
                                        <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                            {sizes.map((size) => (
                                                <div key={size} className="flex items-center">
                                                    <input
                                                        id={`size-${size}`}
                                                        name="size"
                                                        value={size}
                                                        type="checkbox"
                                                        checked={filters.size.includes(size)}
                                                        onChange={() => handleFilterChange("size", size)}
                                                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <label htmlFor={`size-${size}`} className="ml-3 text-sm text-gray-600">
                                                        {size}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-200 py-6">
                                        <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            {colors.map((color) => (
                                                <div key={color} className="flex items-center">
                                                    <input
                                                        id={`color-${color}`}
                                                        name="color"
                                                        value={color}
                                                        type="checkbox"
                                                        checked={filters.color.includes(color)}
                                                        onChange={() => handleFilterChange("color", color)}
                                                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <label htmlFor={`color-${color}`} className="ml-3 text-sm text-gray-600">
                                                        {color}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-200 py-6">
                                        <h3 className="text-sm font-medium text-gray-900">Brand</h3>
                                        <div className="mt-2 space-y-2">
                                            {brands.map((brand) => (
                                                <div key={brand} className="flex items-center">
                                                    <input
                                                        id={`brand-${brand}`}
                                                        name="brand"
                                                        value={brand}
                                                        type="checkbox"
                                                        checked={filters.brand.includes(brand)}
                                                        onChange={() => handleFilterChange("brand", brand)}
                                                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-600">
                                                        {brand}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="py-6">
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                </form>

                                {/* Product grid */}
                                <div className="lg:col-span-3">
                                    {/* Applied filters */}
                                    {(filters.category ||
                                        filters.priceRange ||
                                        filters.condition.length > 0 ||
                                        filters.size.length > 0 ||
                                        filters.color.length > 0 ||
                                        filters.brand.length > 0 ||
                                        searchQuery) && (
                                            <div className="bg-white mb-6">
                                                <div className="mx-auto max-w-7xl py-3 px-4 sm:flex sm:items-center">
                                                    <h3 className="text-sm font-medium text-gray-700">Active filters:</h3>
                                                    <div className="mt-2 sm:mt-0 sm:ml-4">
                                                        <div className="-m-1 flex flex-wrap items-center">
                                                            {filters.category && (
                                                                <span className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                                                                    <span>Category: {filters.category}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleFilterChange("category", "")}
                                                                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                                                    >
                                                                        <span className="sr-only">Remove filter for {filters.category}</span>
                                                                        <X className="h-2 w-2" />
                                                                    </button>
                                                                </span>
                                                            )}
                                                            {filters.priceRange && (
                                                                <span className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                                                                    <span>Price: {priceRanges.find((r) => r.value === filters.priceRange)?.label}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleFilterChange("priceRange", "")}
                                                                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                                                    >
                                                                        <span className="sr-only">Remove price filter</span>
                                                                        <X className="h-2 w-2" />
                                                                    </button>
                                                                </span>
                                                            )}
                                                            {searchQuery && (
                                                                <span className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                                                                    <span>Search: {searchQuery}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSearchQuery("")
                                                                            router.push(
                                                                                {
                                                                                    pathname: "/products",
                                                                                    query: { ...router.query, search: undefined },
                                                                                },
                                                                                undefined,
                                                                                { shallow: true },
                                                                            )
                                                                        }}
                                                                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                                                    >
                                                                        <span className="sr-only">Remove search filter</span>
                                                                        <X className="h-2 w-2" />
                                                                    </button>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {filteredProducts.length === 0 ? (
                                        <div className="text-center py-12">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                            <p className="text-gray-500">Try adjusting your filters or search query.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                            {filteredProducts.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </Layout>
    )
}

