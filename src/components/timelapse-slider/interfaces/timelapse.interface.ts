export interface TimelapseEvent {
	date: number;
	text: string;
}

export interface Timelapse {
	id: number;
	name?: string | null;
	events: TimelapseEvent[];
}
