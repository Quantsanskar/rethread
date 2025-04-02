import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">ReThread</h3>
                        <p className="text-gray-400 mb-4">
                            ReThread is a platform for buying and selling pre-loved clothing at affordable prices while reducing
                            textile waste.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-400 hover:text-white">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products?category=women" className="text-gray-400 hover:text-white">
                                    Women
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=men" className="text-gray-400 hover:text-white">
                                    Men
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=kids" className="text-gray-400 hover:text-white">
                                    Kids
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=accessories" className="text-gray-400 hover:text-white">
                                    Accessories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                <span className="text-gray-400">123 Fashion Street, Textile City, India</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                <a href="tel:+911234567890" className="text-gray-400 hover:text-white">
                                    +91 123 456 7890
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                <a href="mailto:info@rethread.com" className="text-gray-400 hover:text-white">
                                    info@rethread.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} ReThread. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                                Terms of Service
                            </Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="/faq" className="text-gray-400 hover:text-white text-sm">
                                FAQ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

