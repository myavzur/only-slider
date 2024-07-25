import { Timelapse } from "../../interfaces";

export interface CarouselProps {
	timelapses: Timelapse[];
	selectedTimelapseIndex: number;
	onSelect: (index: number) => void;
}
