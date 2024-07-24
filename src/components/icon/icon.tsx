import cn from "classnames";
import { FC } from "react";

import sprite from "./assets/sprite.svg";
import { IconProps } from "./props.interface";
import styles from "./styles.module.scss";

export const Icon: FC<IconProps> = ({ icon, isMirrored }) => {
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
