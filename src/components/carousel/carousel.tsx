import { useGSAP } from "@gsap/react";
import cn from "classnames";
import { gsap } from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import { useRef } from "react";

import { getCircleShapePath } from "./helpers";
import { CarouselProps } from "./props.interface";
import styles from "./styles.module.scss";

gsap.registerPlugin(MotionPathPlugin);

const CAROUSEL_WIDTH = 1000;
const CAROUSEL_CENTER_CORD = CAROUSEL_WIDTH / 2;
const CAROUSEL_RADIUS = CAROUSEL_CENTER_CORD - 230;

const createGsapSelector = (
	role: "group" | "circle" | "text" | "label" | "path",
	index?: number
) => {
	if (!index) return `[data-role="${role}"]`;

	return `[data-role="${role}"][data-index="${index}"]`;
};

export const Carousel = <T extends unknown>({
	items,
	selectedIndex,
	onSelect,
	renderLabel
}: CarouselProps<T>) => {
	const containerRef = useRef<SVGSVGElement | null>(null);

	// Позиционирование элементов вокруг круга
	useGSAP(
		() => {
			const pathSelector = createGsapSelector("path");

			items.forEach((_, index) => {
				const groupSelector = createGsapSelector("group", index);
				const position = index / items.length - 1;

				gsap.to(groupSelector, {
					immediateRender: true,
					motionPath: {
						path: pathSelector,
						alignOrigin: [0.5, 0.5],
						start: -0.5 - position,
						end: -1.5
					},
					paused: true
				});
			});
		},
		{ scope: containerRef, dependencies: [items] }
	);

	// Прокрутка к выбранному элементу
	useGSAP(
		() => {
			const containerEl = containerRef.current;

			const groupSelector = createGsapSelector("group", selectedIndex);
			const circleSelector = createGsapSelector("circle", selectedIndex);
			const textSelector = createGsapSelector("text", selectedIndex);
			const labelSelector = createGsapSelector("label", selectedIndex);

			const angle = (360 / items.length) * selectedIndex;
			const finalAngle = angle - 115;

			gsap.to(containerEl, {
				duration: 1,
				rotate: -finalAngle,
				transformOrigin: "center center"
			});

			gsap
				.timeline()
				.to(
					[createGsapSelector("group"), createGsapSelector("circle")],
					{
						attr: {
							r: 5,
							fill: "rgb(66, 86, 122)"
						}
					},
					"Hiding inactive dots"
				)
				.to(
					[createGsapSelector("text"), createGsapSelector("label")],
					{
						opacity: 0
					},
					"Hiding inactive dots"
				)
				.to(
					[groupSelector, circleSelector],
					{
						attr: {
							r: 25,
							fill: "#F4F5F9",
							strokeWidth: 1,
							stroke: "rgb(48, 62, 88, 0.5)"
						}
					},
					"Showing active dot"
				)
				.to(
					[textSelector, labelSelector],
					{
						immediateRender: true
					},
					"Showing active dots"
				)
				.to(
					[textSelector, labelSelector],
					{
						opacity: 1
					},
					"Showing active dot"
				);
		},
		{ scope: containerRef, dependencies: [selectedIndex] }
	);

	return (
		<svg
			ref={containerRef}
			className={styles.canvas}
			width={`${CAROUSEL_WIDTH}`}
			height={`${CAROUSEL_WIDTH}`}
			viewBox={`0 0 ${CAROUSEL_WIDTH} ${CAROUSEL_WIDTH}`}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				data-role="path"
				className={styles.canvas__path}
				d={getCircleShapePath([
					CAROUSEL_CENTER_CORD,
					CAROUSEL_CENTER_CORD,
					CAROUSEL_RADIUS
				])}
			/>

			{items.map((item, index) => (
				<g
					data-role="group"
					data-index={index}
					className={cn(styles.canvas__group)}
					key={index}
					onClick={() => onSelect(index)}
				>
					<circle
						data-role="circle"
						data-index={index}
						r={15}
					/>

					<text
						data-role="text"
						data-index={index}
						className={styles.canvas__text}
						textAnchor="middle"
						dy="0.3em"
					>
						{index + 1}
					</text>

					{renderLabel && (
						<text
							data-role="label"
							data-index={index}
							className={styles.canvas__label}
							x="45"
							dy="0.3em"
						>
							{renderLabel(item)}
						</text>
					)}
				</g>
			))}
		</svg>
	);
};
