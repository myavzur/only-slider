export interface NavigationProps {
	onPrev: () => void;
	isPrevDisabled: boolean;

	onNext: () => void;
	isNextDisabled: boolean;

	progress: string;
	className?: string;
}
