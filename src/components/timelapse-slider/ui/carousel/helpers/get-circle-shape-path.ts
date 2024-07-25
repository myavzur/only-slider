/*
	Формула для отрисовки круговой формы через <path/>
			M cx cy
			m r, 0
			a r,r 0 1,0 -(r * 2),0
			a r,r 0 1,0  (r * 2),0
	Взято отсюда: "https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334"
*/
export const getCircleShapePath = ([cx, cy, radius]: [
	number,
	number,
	number
]): string => {
	return `
		M ${cx} ${cy}
		m ${radius}, 0
		a ${radius}, ${radius} 0 1, 0 -${radius * 2}, 0
		a ${radius}, ${radius} 0 1, 0 ${radius * 2}, 0
	`;
};
