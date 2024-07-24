import cn from "classnames";
import { SliderProps } from "./props.interface";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";

import { InnerNavigation } from "./inner-navigation";
import styles from "./styles.module.scss";


export const Slider = <T extends unknown>({ slides, children, className }: SliderProps<T>) => {
	return (
		<Swiper
			className={cn(styles.slider, className)}
			spaceBetween={80}
			slidesPerView={3}
			grabCursor={true}
		>
			{slides.map((slide, idx) => (
				<SwiperSlide key={idx} className={styles.slider__slide}>
					{children(slide)}
				</SwiperSlide>
			))}

			<InnerNavigation />
		</Swiper>
	);
};