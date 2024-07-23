import cn from "classnames";
import { SliderProps } from "./props.interface";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";

import { SliderNavigation } from "./slider-navigation";

export const Slider = <T extends unknown>({ slides, children, className }: SliderProps<T>) => {
	return (
		<Swiper
			className={cn(className)}
			spaceBetween={80}
			slidesPerView={3}
		>
			{slides.map((slide, idx) => (
				<SwiperSlide key={idx}>
					{children(slide)}
				</SwiperSlide>
			))}

			{/* <SliderNavigation /> */}
		</Swiper>
	);
};