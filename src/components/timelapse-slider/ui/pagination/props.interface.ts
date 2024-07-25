export interface PaginationProps {
	selectedIndex: number;
	pages: number;
	onClick: (index: number) => void;
}
