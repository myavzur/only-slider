import { ReactNode } from "react";

export interface SliderProps<T> {
	slides: T[];
	children: (slide: T) => ReactNode;
}
