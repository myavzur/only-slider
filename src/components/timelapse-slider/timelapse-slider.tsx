import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";
import { TimelapseSliderProps } from "./props.interface";
import { killTweenIfExists, padZero } from "@/helpers";
import { Carousel } from "./ui/carousel";
import { Icon } from "@/components/icon";
import { gsap } from "gsap";
import { Slider } from "@/components/slider";
import { Title } from "./ui/title";
import { findEventsRange } from "./helpers";
import { Navigation } from "./ui/navigation";
import { EventSlide } from "./ui/event-slide";
import { useGSAP } from "@gsap/react";

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

	const containerRef = useRef<HTMLDivElement | null>(null);
	const eventsRangeMinRef = useRef<HTMLParagraphElement | null>(null);
	const eventsRangeMaxRef = useRef<HTMLParagraphElement | null>(null);
	const eventsSliderRef = useRef<HTMLDivElement | null>(null);

	const { contextSafe } = useGSAP({ scope: containerRef });

	const selectTimelapse = contextSafe(
		(index: number) => {
		const newTimelapse = timelapses[index];
		const isAlreadySelected = selectedTimelapseIndex === index;
		if (isAlreadySelected || !newTimelapse) return;

		const eventsRange = findEventsRange(newTimelapse);
		setSelectedTimelapseIndex(index);

		killTweenIfExists("Animate slider and range");
		gsap.timeline({ id: "Animate slider and range" })
			.to(
				eventsSliderRef.current,
				{
					opacity: 0,
					y: 10,
					ease: "power4.out",
					onComplete: () => {
						setSelectedTimelapse(newTimelapse);
					}
				}
			)
			.to(
				eventsRangeMinRef.current,
				{
					innerText: eventsRange.min,
					snap: "innerText",
					ease: "power4.out",
					duration: 1
				},
				"<"
			)
			.to(
				eventsRangeMaxRef.current,
				{
					innerText: eventsRange.max,
					snap: "innerText",
					ease: "power4.out",
					duration: 1
				},
				"<"
			)
			.to(
				eventsSliderRef.current,
				{
					opacity: 1,
					y: 10
				}
			);
	});

	const prevTimelapse = useCallback(() => {
		if (selectedTimelapseIndex === 0) return;
		selectTimelapse(selectedTimelapseIndex - 1);
	}, [selectedTimelapseIndex, selectTimelapse]);

	const nextTimelapse = useCallback(() => {
		if (selectedTimelapseIndex === timelapses.length - 1) return;
		selectTimelapse(selectedTimelapseIndex + 1);
	}, [selectedTimelapseIndex, selectTimelapse, timelapses]);

	// Render initial events range values.
	useEffect(() => {
		if (!eventsRangeMinRef.current || !eventsRangeMaxRef.current) return;

		const eventsRange = findEventsRange(selectedTimelapse);
		eventsRangeMinRef.current.innerText = String(eventsRange.min);
		eventsRangeMaxRef.current.innerText = String(eventsRange.max);
	}, []);

	return (
		<div className={styles.timelapse} ref={containerRef}>
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

					<span className={styles.range}>
						<p
							ref={eventsRangeMinRef}
							className={cn(styles.range__value, styles.range__value_min)}
						>
							1024
						</p>

						<p
							ref={eventsRangeMaxRef}
							className={cn(styles.range__value, styles.range__value_max)}
						>
							2024
						</p>
					</span>

					<div className={styles.controller__carousel}>
						<Carousel
							items={timelapses}
							selectedIndex={selectedTimelapseIndex}
							onSelect={selectTimelapse}
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
					ref={eventsSliderRef}
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