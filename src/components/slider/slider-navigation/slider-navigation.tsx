import cn from "classnames";
import { FC, useEffect, useState } from "react";

import styles from "../styles.module.scss";
import { useSwiper } from "swiper/react";
import { Icon } from "@/components/icon";
import { useEvent } from "@/hooks";

export const SliderNavigation: FC = () => {
	const swiper = useSwiper();

	const [_, forceUpdate] = useState(1);

	const handleSlideChange = useEvent(() => {
		forceUpdate(Math.random());
	});

	useEffect(() => {
		swiper.on("slideChange", handleSlideChange);
		return () => swiper.off("slideChange", handleSlideChange);
	})

	return (
		<div className={styles.slider__controls}>
			<button
				className={cn(styles.slider__controller, styles.slider__controller_prev)}
				disabled={swiper.isBeginning}
				onClick={() => swiper.slidePrev()}
			>
				<Icon icon="arrow-left" />
			</button>

			<button
				className={cn(styles.slider__controller, styles.slider__controller_next)}
				disabled={swiper.isEnd}
				onClick={() => swiper.slideNext()}
			>
				<Icon icon="arrow-left" />
			</button>
		</div>
	);
};