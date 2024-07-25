import cn from "classnames";
import React, { FC, useCallback, useEffect, useRef } from "react";
import "swiper/css";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import { Icon } from "../icon";
import { SliderProps } from "./props.interface";
import styles from "./styles.module.scss";

export const Slider: FC<SliderProps> = ({ children }) => {
	const sliderEl = useRef<SwiperRef | null>(null);
	const controlPrevEl = useRef<HTMLButtonElement | null>(null);
	const controlNextEl = useRef<HTMLButtonElement | null>(null);

	const updateControls = useCallback(() => {
		if (!sliderEl.current || !controlPrevEl.current || !controlNextEl.current)
			return;

		const swiper = sliderEl.current.swiper;

		if (swiper.isBeginning) {
			controlPrevEl.current.setAttribute("disabled", "true");
		} else {
			controlPrevEl.current.removeAttribute("disabled");
		}

		if (swiper.isEnd) {
			controlNextEl.current.setAttribute("disabled", "true");
		} else {
			controlNextEl.current.removeAttribute("disabled");
		}
	}, []);

	const handleSlidePrev = useCallback(() => {
		if (!sliderEl.current) return;
		const swiper = sliderEl.current.swiper;
		swiper.slidePrev();

		updateControls();
	}, [updateControls]);

	const handleSlideNext = useCallback(() => {
		if (!sliderEl.current) return;
		const swiper = sliderEl.current.swiper;
		swiper.slideNext();

		updateControls();
	}, [updateControls]);

	useEffect(() => {
		updateControls();
	}, [updateControls]);

	return (
		<div className={styles.slider}>
			<Swiper
				ref={sliderEl}
				spaceBetween={80}
				slidesPerView={3}
				grabCursor={true}
			>
				{React.Children.map(children, (child, index) => (
					<SwiperSlide>{child}</SwiperSlide>
				))}
			</Swiper>

			<button
				ref={controlPrevEl}
				className={cn(styles.slider__control, styles.slider__control_prev)}
				onClick={handleSlidePrev}
			>
				<Icon icon="arrow-left" />
			</button>

			<button
				ref={controlNextEl}
				className={cn(styles.slider__control, styles.slider__control_next)}
				onClick={handleSlideNext}
			>
				<Icon
					icon="arrow-left"
					isMirrored={true}
				/>
			</button>
		</div>
	);
};
