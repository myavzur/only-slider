import { useGSAP } from "@gsap/react";
import cn from "classnames";
import { gsap } from "gsap";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { killTweenIfExists, padZero } from "@/helpers";

import { useMatchesWindowWidth } from "@/hooks";

import { Icon } from "@/components/icon";
import { Slider } from "@/components/slider";

import { findEventsRange } from "./helpers";
import { TimelapseSliderProps } from "./props.interface";
import styles from "./styles.module.scss";
import { Carousel } from "./ui/carousel";
import { EventSlide } from "./ui/event-slide";
import { Navigation } from "./ui/navigation";
import { Pagination } from "./ui/pagination";
import { Title } from "./ui/title";

export const TimelapseSlider: FC<TimelapseSliderProps> = ({
	title,
	timelapses,
	defaultSelected
}) => {
	const [selectedTimelapse, setSelectedTimelapse] = useState(() => {
		if (!defaultSelected) return timelapses[0];
		return defaultSelected;
	});

	const [selectedTimelapseIndex, setSelectedTimelapseIndex] = useState(() => {
		const index = timelapses.findIndex(({ id }) => id === selectedTimelapse.id);

		if (index === -1) {
			throw new Error(
				`Wrong Timelapse Slider configuration. Could not find timelapse with id ${selectedTimelapse.id} in timelapses array.`
			);
		}

		return index;
	});

	const sortedEvents = useMemo(() => {
		return selectedTimelapse.events.sort((a, b) => a.date - b.date);
	}, [selectedTimelapse]);

	const shouldRenderCarousel = useMatchesWindowWidth(">", 820);
	const shouldRenderPagination = useMatchesWindowWidth("<", 420);

	const containerRef = useRef<HTMLDivElement | null>(null);
	const eventsRangeMinRef = useRef<HTMLParagraphElement | null>(null);
	const eventsRangeMaxRef = useRef<HTMLParagraphElement | null>(null);
	const eventsSliderRef = useRef<HTMLDivElement | null>(null);

	const { contextSafe } = useGSAP({ scope: containerRef });

	const selectTimelapse = contextSafe((index: number) => {
		const newTimelapse = timelapses[index];
		const isAlreadySelected = selectedTimelapseIndex === index;
		if (isAlreadySelected || !newTimelapse) return;

		const eventsRange = findEventsRange(newTimelapse);
		setSelectedTimelapseIndex(index);

		killTweenIfExists("Animate slider and range");
		gsap
			.timeline({ id: "Animate slider and range" })
			.to(eventsSliderRef.current, {
				opacity: 0,
				ease: "power4.out",
				onComplete: () => {
					setSelectedTimelapse(newTimelapse);
				}
			})
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
			.to(eventsSliderRef.current, {
				opacity: 1
			});
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
		<div
			className={styles.timelapse}
			ref={containerRef}
		>
			<Title className={styles.timelapse__title}>{title}</Title>

			<div className={cn(styles.timelapse__controller, styles.controller)}>
				{shouldRenderCarousel && (
					<>
						<div
							className={cn(
								styles.controller__line,
								styles.controller__line_vertical
							)}
						/>

						<div
							className={cn(
								styles.controller__line,
								styles.controller__line_horizontal
							)}
						/>

						<div className={styles.controller__carousel}>
							<Carousel
								items={timelapses}
								selectedIndex={selectedTimelapseIndex}
								onSelect={selectTimelapse}
							/>
						</div>
					</>
				)}

				<span className={styles.controller__range}>
					<p
						ref={eventsRangeMinRef}
						className={cn(
							styles["controller__range-value"],
							styles["controller__range-value_min"]
						)}
					>
						1024
					</p>

					<p
						ref={eventsRangeMaxRef}
						className={cn(
							styles["controller__range-value"],
							styles["controller__range-value_max"]
						)}
					>
						2024
					</p>
				</span>

				<div className={styles.controller__controls}>
					<Navigation
						onPrev={prevTimelapse}
						isPrevDisabled={selectedTimelapseIndex === 0}
						onNext={nextTimelapse}
						isNextDisabled={selectedTimelapseIndex === timelapses.length - 1}
						progress={`${padZero(selectedTimelapseIndex + 1)}/${padZero(timelapses.length)}`}
					/>

					{shouldRenderPagination && (
						<div className={styles.controller__pagination}>
							<Pagination
								pages={timelapses.length}
								onClick={selectTimelapse}
								selectedIndex={selectedTimelapseIndex}
							/>
						</div>
					)}
				</div>
			</div>

			<div
				className={styles.timelapse__events}
				ref={eventsSliderRef}
			>
				<h3 className={styles.timelapse__label}>{selectedTimelapse.name}</h3>

				<Slider>
					{sortedEvents.map((event, index) => (
						<EventSlide
							key={index}
							event={event}
						/>
					))}
				</Slider>
			</div>
		</div>
	);
};
