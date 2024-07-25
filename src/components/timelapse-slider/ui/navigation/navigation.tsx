import cn from "classnames";
import { FC } from "react";

import { Icon } from "@/components/icon";

import { NavigationProps } from "./props.interface";
import styles from "./styles.module.scss";

export const Navigation: FC<NavigationProps> = ({
	onPrev,
	isPrevDisabled,
	onNext,
	isNextDisabled,
	progress,
	className
}) => {
	return (
		<div className={cn(styles.navigation, className)}>
			<span className={styles.navigation__progress}>{progress}</span>

			<div className={styles.navigation__controls}>
				<button
					className={styles.navigation__control}
					onClick={onPrev}
					disabled={isPrevDisabled}
				>
					<Icon icon="arrow-left" />
				</button>
				<button
					className={styles.navigation__control}
					onClick={onNext}
					disabled={isNextDisabled}
				>
					<Icon
						icon="arrow-left"
						isMirrored={true}
					/>
				</button>
			</div>
		</div>
	);
};
