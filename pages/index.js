"use client"

import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Layout from "../components/Layout"
import ProductCard from "../components/ProductCard"
import { featuredProducts } from "../utils/data"
import { Search, ChevronRight } from "lucide-react"

const Home=()=> {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { name: "Women", image: "/images/category-women.jpg" },
    { name: "Men", image: "/images/category-men.jpg" },
    { name: "Kids", image: "/images/category-kids.jpg" },
    { name: "Accessories", image: "/images/category-accessories.jpg" },
  ]

  return (
    <Layout>
      <Head>
        <title>ReThread - Give Your Clothes a Second Life</title>
        <meta name="description" content="Buy and sell second-hand clothing at affordable prices" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gray-100 h-[500px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/placeholder.svg?height=500&width=1920"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Give Your Clothes a Second Life</h1>
            <p className="text-xl text-white mb-8">
              Buy and sell pre-loved clothing at affordable prices while reducing textile waste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg text-center"
              >
                Shop Now
              </Link>
              <Link
                href="/seller/upload"
                className="bg-white hover:bg-gray-100 text-emerald-600 font-semibold py-3 px-6 rounded-lg text-center"
              >
                Sell Your Clothes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for clothes, brands, and more..."
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link href={`/products?category=${category.name.toLowerCase()}`} key={index} className="group">
                <div className="relative rounded-lg overflow-hidden h-48 md:h-64">
                  <img
                    src={`/placeholder.svg?height=300&width=300&text=${category.name}`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose ReThread</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cost-Effective</h3>
              <p className="text-gray-600">
                Purchase quality second-hand clothing at affordable prices and sell your unused items.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Reduce textile waste and environmental impact by giving clothes a second life.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Our integrated payment gateway ensures safe and reliable financial exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src="/placeholder.svg?height=50&width=50" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Ayesha Singh</h4>
                  <p className="text-gray-600 text-sm">College Student</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a college student on a budget, ReThread has been a game-changer! I can find trendy outfits at
                affordable prices while making eco-friendly choices."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src="/placeholder.svg?height=50&width=50" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Raj Malhotra</h4>
                  <p className="text-gray-600 text-sm">Working Professional</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I had clothes gathering dust in my wardrobe. Thanks to ReThread, I've cleared space and earned extra
                cash by selling them to people who actually need them!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src="/placeholder.svg?height=50&width=50" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Priya Sharma</h4>
                  <p className="text-gray-600 text-sm">Parent</p>
                </div>
              </div>
              <p className="text-gray-600">
                "With growing kids who outgrow clothes quickly, ReThread has been a blessing. I find quality second-hand
                clothes at great prices and resell them when they're outgrown."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Give Your Clothes a Second Life?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of users who are buying and selling pre-loved clothing on ReThread.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg"
            >
              Sign Up Now
            </Link>
            <Link
              href="/products"
              className="bg-transparent hover:bg-emerald-700 border border-white font-semibold py-3 px-6 rounded-lg"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home;