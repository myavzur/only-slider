import { useEffect, useState } from "react";

import { useEvent } from "./use-event";

export const useMatchesWindowWidth = (type: "<" | ">", width: number) => {
	const [isMatches, setIsMatches] = useState(false);

	const handleWindowResize = useEvent(() => {
		let isMatches = false;

		switch (type) {
			case "<": {
				isMatches = window.matchMedia(`(max-width: ${width}px)`).matches;
				break;
			}
			case ">": {
				isMatches = window.matchMedia(`(min-width: ${width}px)`).matches;
			}
		}

		setIsMatches(isMatches);
	});

	useEffect(() => {
		handleWindowResize();

		window.addEventListener("resize", handleWindowResize);
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []);

	return isMatches;
};
