import { FC, useCallback, useRef, useState } from "react";
import cn from "classnames";

import { gsap } from "gsap";
import MotionPathPlugin from 'gsap/MotionPathPlugin';

import { CarouselProps } from "./props.interface";
import styles from "./styles.module.scss";
import { getCircleShapePath } from "./helpers";
import { useGSAP } from "@gsap/react";
import { useEvent } from "@/hooks";

gsap.registerPlugin(MotionPathPlugin);

const CAROUSEL_WIDTH = 1000;
const CAROUSEL_CENTER_CORD = CAROUSEL_WIDTH / 2;
const CAROUSEL_RADIUS = CAROUSEL_CENTER_CORD - 230;

export const Carousel = <T extends unknown>({ items, selectedItemIndex, onSelectItem, renderItemLabel }: CarouselProps<T>) => {
	const canvasRef = useRef<SVGSVGElement | null>(null);
	const shapeRef = useRef<SVGPathElement | null>(null);
	const controlsRef = useRef<SVGGElement[]>([]);

	const handleControlRef = (node: SVGGElement | null, index: number) => {
		if (!node) return;
		controlsRef.current[index] = node;
	};

	// Позиционирование элементов вокруг круга
	useGSAP(() => {
		if (!shapeRef.current) return;

		items.forEach(((_, index) => {
			if (!controlsRef.current?.[index]) return;

			const controlEl = controlsRef.current[index];
			const position = index / items.length - 1;

			gsap.to(controlEl, {
				immediateRender: true,
				motionPath: {
					path: shapeRef.current!,
					alignOrigin: [0.5, 0.5],
					start: -0.5 - position,
					end: -1.5,
				},
				paused: true
			});
		}));
	}, { scope: canvasRef, dependencies: [items] });

	// Прокрутка к выбранному элементу
	useGSAP(() => {
		const angle = (360 / items.length) * selectedItemIndex;
		// Выбранный элемент устанавливаем в 15 градусов
		const finalAngle = angle - 115;

		gsap.to(canvasRef.current, {
			duration: 1,
			rotate: -finalAngle,
			transformOrigin: "center center",
			onUpdate: () => {
				// Одновременно вращаем текстовые элементы
				gsap.to("text", {
					rotate: finalAngle
				})
			}
		});
	}, { scope: canvasRef, dependencies: [selectedItemIndex] });

	return (
		<svg ref={canvasRef} className={styles.canvas} width={`${CAROUSEL_WIDTH}`} height={`${CAROUSEL_WIDTH}`} viewBox={`0 0 ${CAROUSEL_WIDTH} ${CAROUSEL_WIDTH}`} xmlns="http://www.w3.org/2000/svg">
			<path ref={shapeRef} className={styles.canvas__path} d={getCircleShapePath([CAROUSEL_CENTER_CORD, CAROUSEL_CENTER_CORD, CAROUSEL_RADIUS])} />

			{items.map((item, index) => (
				<g
					ref={node => handleControlRef(node, index)}
					className={styles.canvas__control}
					key={index}
					onClick={() => onSelectItem(index)}
				>
					<circle className={styles.canvas__circle} r={25} />
					<text className={styles.canvas__text} textAnchor="middle" dy="0.3em">{index + 1}</text>

					{renderItemLabel && (
						<text className={styles.canvas__label} x="10%">{renderItemLabel(item)}</text>
					)}
				</g>
			))}
		</svg>
	);
};