export const padZero = (num: number) => {
	return num < 10 ? `0${num}` : `${num}`;
};
