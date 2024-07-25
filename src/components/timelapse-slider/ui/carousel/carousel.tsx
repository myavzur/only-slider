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

const INACTIVE_DOT_ATTRS: gsap.AttrVars = {
	r: 5,
	fill: "rgb(66, 86, 122)"
};

const ACTIVE_DOT_ATTRS: gsap.AttrVars = {
	r: 25,
	fill: "rgb(255, 255, 255)",
	strokeWidth: 1,
	stroke: "rgb(48, 62, 88, 0.5)"
};

export const Carousel = <T extends unknown>({
	items,
	selectedIndex,
	onSelect
}: CarouselProps<T>) => {
	const containerRef = useRef<SVGSVGElement | null>(null);

	// Позиционирование элементов вокруг круга
	useGSAP(
		(context) => {
			const placeDotsTween = gsap.getById("Place dots");

			if (placeDotsTween && placeDotsTween.isActive()) {
				placeDotsTween.kill();
			}

			items.forEach((_, index) => {
				const groupSelector = `g[data-index="${index}"]`;
				const position = index / items.length - 1;

				gsap.to(groupSelector, {
					id: "Place dots",
					immediateRender: true,
					motionPath: {
						path: "path",
						alignOrigin: [0.5, 0.5],
						start: -0.5 - position,
						end: -1.5
					},
					paused: true,
					onComplete: () => {
						context.kill();
					}
				});
			});
		},
		{ scope: containerRef, dependencies: [items] }
	);

	// Прокрутка к выбранному элементу
	useGSAP(
		(context) => {
			const containerEl = containerRef.current;
			const currentGroupSelector = `g[data-index="${selectedIndex}"]`;

			const angle = (360 / items.length) * selectedIndex;
			const finalAngle = angle - 115;

			const rotateCarouselTween = gsap.getById("Rotate carousel");
			if (rotateCarouselTween && rotateCarouselTween.isActive()) {
				rotateCarouselTween.kill();
			}

			gsap
				.timeline({
					id: "Rotate carousel",
					onComplete: () => {
						context.kill();
					}
				})
				.to(containerEl, {
					duration: 1,
					rotate: -finalAngle,
					transformOrigin: "center center",
					onUpdate: () => {
						gsap.to("g", {
							rotate: finalAngle,
							transformOrigin: "center center"
						});
					}
				})
				.to(
					["g", "circle"],
					{
						attr: INACTIVE_DOT_ATTRS
					},
					"<"
				)
				.to(
					["text"],
					{
						opacity: 0
					},
					"<"
				)
				.to([currentGroupSelector, `${currentGroupSelector}>circle`], {
					attr: ACTIVE_DOT_ATTRS
				})
				.to(
					`${currentGroupSelector}>text`,
					{
						opacity: 1
					},
					"<"
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
				data-gsap-id="path"
				className={styles.canvas__path}
				d={getCircleShapePath([
					CAROUSEL_CENTER_CORD,
					CAROUSEL_CENTER_CORD,
					CAROUSEL_RADIUS
				])}
			/>

			{items.map((item, index) => (
				<g
					data-index={index}
					className={cn(styles.canvas__group)}
					key={index}
					onClick={() => onSelect(index)}
				>
					<circle {...INACTIVE_DOT_ATTRS} />

					<text
						data-gsap-id="text"
						className={styles.canvas__text}
						textAnchor="middle"
						dy="0.3em"
					>
						{index + 1}
					</text>
				</g>
			))}
		</svg>
	);
};
