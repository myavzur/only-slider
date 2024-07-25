import { Timelapse } from "./interfaces";

export interface TimelapseSliderProps {
	title: string;
	timelapses: Timelapse[];
	defaultSelected?: Timelapse;
}
