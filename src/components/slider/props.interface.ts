import { ReactNode } from "react";

export interface SliderProps<T> {
	className?: string;
	slides: T[];
	children: (slide: T) => ReactNode;
}