import cn from "classnames";
import { FC } from "react";

import { TitleProps } from "./props.interface";
import styles from "./styles.module.scss";

export const Title: FC<TitleProps> = ({ children, className }) => {
	return (
		<span className={cn(styles.title, className)}>
			<h1 className={styles.title__heading}>{children}</h1>
		</span>
	);
};
