// Install Swiper.js before using this component
// Run: npm install swiper

"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const ProductSlider = () => {
  const products = [
    { id: 1, image: "/images/i1.jpg" },
    { id: 2, image: "/images/i2.jpg" },
    { id: 3, image: "/images/i3.jpg" },
    { id: 4, image: "/images/i4.jpg" },
    { id: 5, image: "/images/i5.jpg" },
    { id: 6, image: "/images/i6.jpg" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-10">
      <h2 className="text-xl font-bold text-center mb-4"></h2>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true} // Enables infinite loop
        speed={1500} // Smooth transition speed
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="mySwiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="flex flex-col items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-60 h-60 object-cover rounded-lg shadow-lg"
            />
            <p className="mt-2 text-lg font-medium">{product.name}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;

