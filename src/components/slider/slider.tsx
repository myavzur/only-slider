import cn from "classnames";
import { SliderProps } from "./props.interface";
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import "swiper/css";

import styles from "./styles.module.scss";
import { useCallback, useEffect, useRef } from "react";
import { Icon } from "../icon";


export const Slider = <T extends unknown>({ slides, children, className }: SliderProps<T>) => {
	const sliderEl = useRef<SwiperRef | null>(null);
	const controlPrevEl = useRef<HTMLButtonElement | null>(null);
	const controlNextEl = useRef<HTMLButtonElement | null>(null);

	const updateControls = useCallback(() => {
		if (!sliderEl.current || !controlPrevEl.current || !controlNextEl.current) return;

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
	}, [])

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
	}, [slides, updateControls]);

	return (
		<div className={styles.slider}>
			<Swiper
				ref={sliderEl}
				spaceBetween={80}
				slidesPerView={3}
				grabCursor={true}
			>
				{slides.map((slide, index) => (
					<SwiperSlide key={index} className={styles.slider__slide}>
						{children(slide)}
					</SwiperSlide>
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
				<Icon icon="arrow-left" isMirrored={true} />
			</button>
		</div>
	);
};