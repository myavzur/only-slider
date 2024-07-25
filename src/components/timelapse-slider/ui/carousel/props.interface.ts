export interface CarouselProps<T> {
	items: T[];
	selectedIndex: number;
	onSelect: (index: number) => void;
}
