import cn from "classnames";
import { gsap } from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { padZero } from "@/helpers";

import { PageTitle } from "@/components/page-title";
import { Slider } from "@/components/slider";

import { Carousel } from "../carousel";
import { Icon } from "../icon";
import { PageLayout } from "../page-layout";
import { getTimelapseRange, sortTimelapseEventsByDate, timelapseData } from "./data";
import styles from "./styles.module.scss";

export const App = () => {
	const [timelapse, setTimelapse] = useState(timelapseData[0]);
	const [timelapseIndex, setTimelapseIndex] = useState(() => {
		const index = timelapseData.findIndex(({ id }) => id === timelapse.id);
		return index;
	});

	const sortedTimelapseEvents = useMemo(() => {
		return sortTimelapseEventsByDate(timelapse.events);
	}, [timelapse]);

	const timelapseRangeMinEl = useRef<HTMLSpanElement | null>(null);
	const timelapseRangeMaxEl = useRef<HTMLSpanElement | null>(null);
	const sliderEl = useRef<HTMLDivElement | null>(null);

	const selectTimelapse = useCallback(
		(index: number) => {
			if (timelapseIndex === index) return;

			const newTimelapse = timelapseData[index];
			if (!newTimelapse) return;

			const timelapseRange = getTimelapseRange(newTimelapse);
			setTimelapseIndex(index);

			const timeline = gsap.timeline({ id: "time-travel" });

			timeline
				.to(
					sliderEl.current,
					{
						opacity: 0,
						y: 10,
						ease: "power4.out",
						onComplete: () => setTimelapse(newTimelapse)
					},
					"Traveling..."
				)
				.to(
					timelapseRangeMinEl.current,
					{
						innerText: timelapseRange.min,
						snap: "innerText",
						ease: "power4.out",
						duration: 1
					},
					"Traveling..."
				)
				.to(
					timelapseRangeMaxEl.current,
					{
						innerText: timelapseRange.max,
						snap: "innerText",
						ease: "power4.out",
						duration: 1
					},
					"Traveling..."
				)
				.to(
					sliderEl.current,
					{
						opacity: 1,
						y: 10
					},
					"Slider enter"
				);
		},
		[timelapseIndex]
	);

	const prevTimelapse = () => {
		if (timelapseIndex === 0) return;
		selectTimelapse(timelapseIndex - 1);
	};

	const nextTimelapse = () => {
		if (timelapseIndex === timelapseData.length - 1) return;
		selectTimelapse(timelapseIndex + 1);
	};

	// Render initial timelapse range values
	useEffect(() => {
		const timelapseRange = getTimelapseRange(timelapse);

		if (!timelapseRangeMinEl.current || !timelapseRangeMaxEl.current) return;
		timelapseRangeMinEl.current.innerText = String(timelapseRange.min);
		timelapseRangeMaxEl.current.innerText = String(timelapseRange.max);
	}, []);

	return (
		<PageLayout>
			<div className={styles.content}>
				<PageTitle className={styles.content__title}>Исторические даты</PageTitle>

				<div className={cn(styles.content__controller, styles.controller)}>
					<div
						className={cn(styles.controller__line, styles.controller__line_vertical)}
					/>
					<div
						className={cn(
							styles.controller__line,
							styles.controller__line_horizontal
						)}
					/>

					<div className={styles.range}>
						<span
							ref={timelapseRangeMinEl}
							className={cn(styles.range__value, styles.range__value_min)}
						>
							2024
						</span>

						<span
							ref={timelapseRangeMaxEl}
							className={cn(styles.range__value, styles.range__value_max)}
						>
							2024
						</span>
					</div>

					<div className={styles.controller__carousel}>
						<Carousel
							items={timelapseData}
							selectedIndex={timelapseIndex}
							onSelect={selectTimelapse}
							renderLabel={(timelapse) => timelapse.name}
						/>
					</div>

					<div className={styles.controller__navigation}>
						<span className={styles.controller__progress}>
							{padZero(timelapseIndex + 1)}/{padZero(timelapseData.length)}
						</span>

						<div className={styles.controller__controls}>
							<button
								className={styles.controller__control}
								onClick={prevTimelapse}
								disabled={timelapseIndex === 0}
							>
								<Icon icon="arrow-left" />
							</button>
							<button
								className={styles.controller__control}
								onClick={nextTimelapse}
								disabled={timelapseIndex === timelapseData.length - 1}
							>
								<Icon
									icon="arrow-left"
									isMirrored={true}
								/>
							</button>
						</div>
					</div>
				</div>

				<div
					className={styles.content__slider}
					ref={sliderEl}
				>
					<Slider slides={sortedTimelapseEvents}>
						{(slide) => (
							<div
								className={styles.event}
								key={slide.text}
							>
								<h3 className={styles.event__date}>{slide.date}</h3>
								<p className={styles.event__text}>{slide.text}</p>
							</div>
						)}
					</Slider>
				</div>
			</div>
		</PageLayout>
	);
};
