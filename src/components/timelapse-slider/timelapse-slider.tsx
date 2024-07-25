import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";
import { TimelapseSliderProps } from "./props.interface";
import { padZero } from "@/helpers";
import { Carousel } from "./ui/carousel";
import { Icon } from "@/components/icon";
import { gsap } from "gsap";
import { Slider } from "@/components/slider";
import { Title } from "./ui/title";
import { findEventsRange } from "./helpers";
import { Navigation } from "./ui/navigation";
import { EventSlide } from "./ui/event-slide";

export const TimelapseSlider: FC<TimelapseSliderProps> = ({title, timelapses}) => {
	const [selectedTimelapse, setSelectedTimelapse] = useState(timelapses[0]);

	const [selectedTimelapseIndex, setSelectedTimelapseIndex] = useState(() => {
		const index = timelapses.findIndex(({ id }) => id === selectedTimelapse.id);
		return index;
	});

	const progress = `${padZero(selectedTimelapseIndex + 1)}/${padZero(timelapses.length)}`;

	const sortedEvents = useMemo(() => {
		return selectedTimelapse.events.sort((a, b) => a.date - b.date);
	}, [selectedTimelapse]);

	const eventsRangeMinRef = useRef<HTMLSpanElement | null>(null);
	const eventsRangeMaxRef = useRef<HTMLSpanElement | null>(null);
	const sliderRef = useRef<HTMLDivElement | null>(null);

	const selectTimelapse = useCallback(
		(index: number) => {
			if (selectedTimelapseIndex === index) return;

			const newTimelapse = timelapses[index];
			if (!newTimelapse) return;

			const eventsRange = findEventsRange(newTimelapse);
			setSelectedTimelapseIndex(index);

			gsap.timeline()
				.to(
					sliderRef.current,
					{
						opacity: 0,
						y: 10,
						ease: "power4.out",
						onComplete: () => setSelectedTimelapse(newTimelapse)
					},
					"Traveling..."
				)
				.to(
					eventsRangeMinRef.current,
					{
						innerText: eventsRange.min,
						snap: "innerText",
						ease: "power4.out",
						duration: 1
					},
					"Traveling..."
				)
				.to(
					eventsRangeMaxRef.current,
					{
						innerText: eventsRange.max,
						snap: "innerText",
						ease: "power4.out",
						duration: 1
					},
					"Traveling..."
				)
				.to(
					sliderRef.current,
					{
						opacity: 1,
						y: 10
					},
					"Slider enter"
				);
		},
		[selectedTimelapseIndex, timelapses]
	);

	const prevTimelapse = () => {
		if (selectedTimelapseIndex === 0) return;
		selectTimelapse(selectedTimelapseIndex - 1);
	};

	const nextTimelapse = () => {
		if (selectedTimelapseIndex === timelapses.length - 1) return;
		selectTimelapse(selectedTimelapseIndex + 1);
	};

	// Render initial timelapse range values
	useEffect(() => {
		const eventsRange = findEventsRange(selectedTimelapse);

		if (!eventsRangeMinRef.current || !eventsRangeMaxRef.current) return;
		eventsRangeMinRef.current.innerText = String(eventsRange.min);
		eventsRangeMaxRef.current.innerText = String(eventsRange.max);
	}, []);

	return (
		<div className={styles.timelapse}>
				<Title className={styles.timelapse__title}>{title}</Title>

				<div className={cn(styles.timelapse__controller, styles.controller)}>
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
							ref={eventsRangeMinRef}
							className={cn(styles.range__value, styles.range__value_min)}
						>
							1024
						</span>

						<span
							ref={eventsRangeMaxRef}
							className={cn(styles.range__value, styles.range__value_max)}
						>
							2024
						</span>
					</div>

					<div className={styles.controller__carousel}>
						<Carousel
							items={timelapses}
							selectedIndex={selectedTimelapseIndex}
							onSelect={selectTimelapse}
							renderLabel={(timelapse) => timelapse.name}
						/>
					</div>

					<Navigation
						className={styles.controller__navigation}
						onPrev={prevTimelapse}
						isPrevDisabled={selectedTimelapseIndex === 0}
						onNext={nextTimelapse}
						isNextDisabled={selectedTimelapseIndex === timelapses.length - 1}
						progress={progress}
					/>
				</div>

				<div
					className={styles.timelapse__events}
					ref={sliderRef}
				>
					<Slider slides={sortedEvents}>
						{(event) => (
							<EventSlide event={event} />
						)}
					</Slider>
				</div>
			</div>
	)
}