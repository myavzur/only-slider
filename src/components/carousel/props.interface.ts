export interface CarouselProps<T> {
	items: T[];
	selectedItemIndex: number;
	onSelectItem: (index: number) => void;
	renderItemLabel?: (item: T) => React.ReactNode;
}
