import cn from "classnames";
import { FC } from "react";

import { IconProps } from "./props.interface";
import styles from "./styles.module.scss";
import sprite from "./assets/sprite.svg";

export const Icon: FC<IconProps> = ({
	icon,
	isMirrored
}) => {
	return (
		<svg
			width="100%"
			height="100%"
			className={cn({
				[styles.mirrored]: isMirrored
			})}
		>
			<use href={sprite + `#${icon}`} />
		</svg>
	);
};