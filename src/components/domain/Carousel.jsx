// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../assets/css/swiper.css";

// import required modules
import { Navigation, Pagination } from "swiper/modules";

// TODO: Checar por que clique na paginação não está funcionando
export default function Carousel({ items }) {
  return (
    <>
      <Swiper pagination={true} navigation={true} modules={[Navigation, Pagination]} className="mySwiper w-[260px] sm:max-w-[260px] h-[300px] md:min-w-[350px] lg:min-w-[350px] md:h-[300px] ">
        {items.map((item, idx) => (
        <SwiperSlide key={idx}>
          {item}
        </SwiperSlide>
      ))}
      </Swiper>
    </>
  );
}
