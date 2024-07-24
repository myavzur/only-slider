interface TimelapseEvent {
	date: number;
	text: string;
}

interface Timelapse {
	id: number;
	name: string;
	events: TimelapseEvent[];
}

export const sortTimelapseEventsByDate = (events: TimelapseEvent[]) => {
	return events.sort((a, b) => a.date - b.date);
};

export const getTimelapseRange = (timelapse: Timelapse) => {
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

export const timelapseData: Timelapse[] = [
	{
		id: 1,
		name: "Кино",
		events: [
			{
				date: 1988,
				text: "<<Кто подставил кролика Роджера>>/Who Framed Roger Rabbit, США (руж. Роберт Земекис)"
			},
			{
				date: 1987,
				text: "<<Хищник>>/Predator, США (реж. Джон Мактирнан)"
			}
		]
	},
	{
		id: 2,
		name: "Наука",
		events: [
			{
				date: 2016,
				text: "Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11"
			},
			{
				date: 2015,
				text: "13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды"
			},
			{
				date: 2019,
				text: "Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi"
			},
			{
				date: 2017,
				text: "Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi"
			},
			{
				date: 2018,
				text: "Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi"
			}
		]
	}
];
