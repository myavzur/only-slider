import { gsap } from "gsap";

export const killTweenIfExists = (id: string) => {
	const tween = gsap.getById(id);

	if (tween && tween.isActive()) {
		tween.kill();
	}
};
