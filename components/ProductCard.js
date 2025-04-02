import Link from "next/link"
import { Heart } from "lucide-react"

export default function ProductCard({ product }) {
    return (
        <div className="group relative">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                <img
                    src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-900">
                        <Link href={`/products/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.seller}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</p>
            </div>
            <button
                type="button"
                className="absolute top-2 right-2 rounded-full bg-white p-2 text-gray-900 shadow-sm hover:bg-gray-100"
            >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
            </button>
        </div>
    )
}

