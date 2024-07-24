interface HistoryEvent {
	year: number;
	text: string;
}

interface History {
	id: number;
	name: string;
	events: HistoryEvent[];
}

export const sortEventsByDate = (events: HistoryEvent[]) => {
	return events.sort((a, b) => a.year - b.year);
};

export const getEventsDateRange = (events: HistoryEvent[]) => {
	const dates = events.map((event) => event.year);

	return {
		min: Math.min(...dates),
		max: Math.max(...dates)
	};
};

export const historyData: History[] = [
	{
		id: 1,
		name: "Наука",
		events: [
			{
				year: 2015,
				text: "13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды"
			},
			{
				year: 2016,
				text: "Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11"
			},
			{
				year: 2017,
				text: "Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi"
			},
			{
				year: 2018,
				text: "Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi"
			},
			{
				year: 2019,
				text: "Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi"
			}
		]
	},
	{
		id: 2,
		name: "Кино",
		events: [
			{
				year: 1987,
				text: "<<Хищник>>/Predator, США (реж. Джон Мактирнан)"
			},
			{
				year: 1988,
				text: "<<Кто подставил кролика Роджера>>/Who Framed Roger Rabbit, США (руж. Роберт Земекис)"
			}
		]
	}
];