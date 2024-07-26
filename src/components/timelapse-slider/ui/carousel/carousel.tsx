import { useGSAP } from "@gsap/react";
import cn from "classnames";
import { gsap } from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import { FC, useRef } from "react";

import { killTweenIfExists } from "@/helpers";

import { useFirstRender } from "@/hooks";

import { getCircleShapePath } from "./helpers";
import { CarouselProps } from "./props.interface";
import styles from "./styles.module.scss";

gsap.registerPlugin(MotionPathPlugin);

const CAROUSEL_WIDTH = 1000;
const CAROUSEL_CENTER_CORD = CAROUSEL_WIDTH / 2;
const CAROUSEL_RADIUS = CAROUSEL_CENTER_CORD - 230;

const IDLING_DOT_ATTRS: gsap.AttrVars = {
	r: 5,
	fill: "rgb(66, 86, 122)"
};

const ACTIVE_DOT_ATTRS: gsap.AttrVars = {
	r: 25,
	fill: "rgb(255, 255, 255)",
	strokeWidth: 1,
	stroke: "rgb(48, 62, 88, 0.5)"
};

const ROTATE_CAROUSEL_TWEEN_ID = "Rotate Carousel";

export const Carousel: FC<CarouselProps> = ({
	timelapses,
	selectedTimelapseIndex,
	onSelect
}) => {
	const isFirstRender = useFirstRender();
	const containerRef = useRef<SVGSVGElement | null>(null);

	// Позиционирование элементов вокруг круга
	useGSAP(
		(context) => {
			killTweenIfExists("Carousel Init");

			timelapses.forEach((_, index) => {
				const dot = `g[data-index="${index}"]`;
				const position = index / timelapses.length - 1;

				gsap.to(dot, {
					id: "Carousel Init",
					immediateRender: true,
					motionPath: {
						path: "path",
						alignOrigin: [0.5, 0.5],
						start: -0.5 - position,
						end: -1.5
					},
					paused: true,
					onComplete: () => {
						// Очищаем контекст, поскольку больше от этой анимации смысла не будет.
						context.kill();
					}
				});
			});
		},
		{ scope: containerRef, dependencies: [timelapses] }
	);

	// Прокрутка к выбранному элементу
	const { contextSafe } = useGSAP(
		() => {
			const angle = (360 / timelapses.length) * selectedTimelapseIndex;
			const finalAngle = angle - 115;

			const containerEl = containerRef.current;
			const selectedDot = `g[data-index="${selectedTimelapseIndex}"]`;
			const durationConfig: Pick<gsap.TweenVars, "duration"> = isFirstRender
				? { duration: 0 }
				: {};

			killTweenIfExists(ROTATE_CAROUSEL_TWEEN_ID);
			const timeline = gsap.timeline({
				id: ROTATE_CAROUSEL_TWEEN_ID,
				onComplete: function () {
					this.kill();
				}
			});

			timeline.to(containerEl, {
				...durationConfig,
				rotate: -finalAngle,
				transformOrigin: "center center",
				onUpdate: () => {
					gsap.to("g", {
						...durationConfig,
						rotate: finalAngle,
						transformOrigin: "center center"
					});
				}
			});

			timeline.to(
				["g", "circle"],
				{
					...durationConfig,
					attr: IDLING_DOT_ATTRS
				},
				"<"
			);

			timeline.to(
				["text"],
				{
					...durationConfig,
					opacity: 0
				},
				"<"
			);

			timeline.to([selectedDot, `${selectedDot}>circle`], {
				...durationConfig,
				attr: ACTIVE_DOT_ATTRS
			});

			timeline.to(
				`${selectedDot}>text`,
				{
					...durationConfig,
					opacity: 1
				},
				"<"
			);
		},
		{ scope: containerRef, dependencies: [selectedTimelapseIndex] }
	);

	const animateDot = contextSafe((index: number, to: "active" | "idle") => {
		const rotateCarouselTween = gsap.getById(ROTATE_CAROUSEL_TWEEN_ID);
		if (rotateCarouselTween?.isActive()) return;

		const selectedDot = `g[data-index="${index}"]`;

		const timeline = gsap.timeline({
			onComplete: function () {
				this.kill();
			}
		});

		timeline.to([selectedDot, `${selectedDot}>circle`], {
			attr: to === "active" ? ACTIVE_DOT_ATTRS : IDLING_DOT_ATTRS
		});

		timeline.to(
			`${selectedDot}>text`,
			{
				opacity: to === "active" ? 1 : 0
			},
			"<"
		);
	});

	const handleGroupHover = contextSafe((index: number) => {
		animateDot(index, "active");
	});

	const handleGroupBlur = contextSafe((index: number) => {
		animateDot(index, "idle");
	});

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

			{timelapses.map((_, index) => (
				<g
					key={index}
					data-index={index}
					className={cn(styles.canvas__dot)}
					onClick={() => onSelect(index)}
					onMouseEnter={() => handleGroupHover(index)}
					onMouseLeave={() => handleGroupBlur(index)}
				>
					<circle {...IDLING_DOT_ATTRS} />

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
