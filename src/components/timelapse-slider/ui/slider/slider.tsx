import cn from "classnames";
import React, { FC, useCallback, useEffect, useRef } from "react";
import "swiper/css";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import { Icon } from "@/components/icon";

import { SliderProps } from "./props.interface";
import styles from "./styles.module.scss";

export const Slider: FC<SliderProps> = ({ children, isMobile }) => {
	const sliderEl = useRef<SwiperRef | null>(null);
	const prevButtonRef = useRef<HTMLButtonElement | null>(null);
	const nextButtonRef = useRef<HTMLButtonElement | null>(null);

	const updateControls = useCallback(() => {
		if (!sliderEl.current || !prevButtonRef.current || !nextButtonRef.current)
			return;

		const swiper = sliderEl.current.swiper;

		if (swiper.isBeginning) {
			prevButtonRef.current.setAttribute("disabled", "true");
		} else {
			prevButtonRef.current.removeAttribute("disabled");
		}

		if (swiper.isEnd) {
			nextButtonRef.current.setAttribute("disabled", "true");
		} else {
			nextButtonRef.current.removeAttribute("disabled");
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
	}, [updateControls, children]);

	return (
		<div className={styles.slider}>
			<Swiper
				ref={sliderEl}
				slidesPerView="auto"
				spaceBetween={0}
				grabCursor={true}
				breakpoints={{
					920: {
						slidesPerView: 2,
						spaceBetween: 40
					},
					1280: {
						slidesPerView: 3,
						spaceBetween: 80
					}
				}}
				onSliderMove={updateControls}
			>
				{React.Children.map(children, (child, index) => (
					<SwiperSlide className={styles.slider__slide}>{child}</SwiperSlide>
				))}
			</Swiper>

			<button
				ref={prevButtonRef}
				className={cn(styles.slider__control, styles.slider__control_prev)}
				onClick={handleSlidePrev}
			>
				<Icon icon="arrow-left" />
			</button>

			<button
				ref={nextButtonRef}
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
