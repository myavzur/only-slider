import { Timelapse } from "../interfaces";

export const findEventsRange = (timelapse: Timelapse) => {
	const events = timelapse.events;

	let min = events[0].date;
	let max = events[0].date;

	for (let i = 0; i < events.length; i++) {
		const event = events[i];

		if (event.date < min) {
			min = event.date;
			continue;
		}

		if (event.date > max) {
			max = event.date;
			continue;
		}
	}

	return { min, max };
};
