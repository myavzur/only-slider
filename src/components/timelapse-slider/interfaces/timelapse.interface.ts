export interface TimelapseEvent {
	date: number;
	text: string;
}

export interface Timelapse {
	id: number;
	label?: string | null;
	events: TimelapseEvent[];
}
